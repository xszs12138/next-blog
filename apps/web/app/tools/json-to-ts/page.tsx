"use client"

import { useState, useCallback } from "react"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { ArrowLeftIcon, BracesIcon, CopyIcon, CheckIcon } from "lucide-react"
import Link from "next/link"

function inferType(value: unknown): string {
  if (value === null) return "null"
  if (Array.isArray(value)) {
    if (value.length === 0) return "any[]"
    const types = new Set(value.map((v) => inferType(v)))
    const merged = [...types]
    if (merged.length === 1) return `${merged[0]}[]`
    return `(${merged.join(" | ")})[]`
  }
  const t = typeof value
  switch (t) {
    case "string": return "string"
    case "number": return "number"
    case "boolean": return "boolean"
    case "object":
      return generateInline(value as Record<string, unknown>)
    default: return "any"
  }
}

function generateInline(obj: Record<string, unknown>): string {
  const keys = Object.keys(obj)
  if (keys.length === 0) return "Record<string, any>"
  const fields = keys.map((k) => {
    const safeKey = /^[a-zA-Z_$][\w$]*$/.test(k) ? k : `"${k}"`
    return `  ${safeKey}: ${inferType(obj[k])};`
  })
  return `{\n${fields.join("\n")}\n}`
}

function generateTypes(json: unknown, rootName = "Root"): string {
  const interfaces: string[] = []
  const seen = new Map<string, string>()

  function collect(name: string, value: unknown): string {
    if (value === null) return "null"
    if (Array.isArray(value)) {
      if (value.length === 0) return "any[]"
      return `${collectItem(name, value[0])}[]`
    }
    if (typeof value === "object") {
      const sig = JSON.stringify(value)
      if (seen.has(sig)) return seen.get(sig)!
      seen.set(sig, name)

      const obj = value as Record<string, unknown>
      const fields = Object.keys(obj).map((k) => {
        const safeKey = /^[a-zA-Z_$][\w$]*$/.test(k) ? k : `"${k}"`
        const childName = `${name}${capitalize(k)}`
        return `  ${safeKey}: ${collect(childName, obj[k])};`
      })

      interfaces.push(`interface ${name} {\n${fields.join("\n")}\n}`)
      return name
    }
    return typeof value
  }

  function collectItem(parentName: string, value: unknown): string {
    if (value === null) return "null"
    if (Array.isArray(value)) {
      if (value.length === 0) return "any[]"
      return `${collectItem(parentName, value[0])}[]`
    }
    if (typeof value === "object") {
      return collect(parentName, value)
    }
    return typeof value
  }

  collect(rootName, json)
  return interfaces.reverse().join("\n\n")
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function JsonToTsPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [rootName, setRootName] = useState("Root")

  const convert = useCallback(() => {
    setError("")
    setOutput("")
    try {
      const json = JSON.parse(input)
      const result = generateTypes(json, rootName || "Root")
      setOutput(result)
    } catch (err) {
      setError(err instanceof SyntaxError ? `JSON 格式错误：${err.message}` : "转换失败，请检查输入")
    }
  }, [input, rootName])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sample = `{
  "name": "张三",
  "age": 25,
  "email": "zhangsan@example.com",
  "tags": ["typescript", "react"],
  "address": {
    "city": "北京",
    "street": "长安街",
    "zip": "100000"
  }
}`

  return (
    <main className="mx-auto max-w-4xl px-4 pt-8 pb-20 sm:px-6 sm:pt-16 sm:pb-24">
      <Link
        href="/tools"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3" /> 返回工具列表
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="text-xl font-semibold">JSON 转 TypeScript 类型</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          将 JSON 数据自动转换为 TypeScript interface 定义。结果仅供参考
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input */}
        <div className="space-y-3">
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-1.5">
              <label className="text-xs text-muted-foreground">根类型名</label>
              <input
                value={rootName}
                onChange={(e) => setRootName(e.target.value)}
                placeholder="Root"
                className="w-full rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:border-ring"
              />
            </div>
            <Button onClick={convert} className="shrink-0">
              <BracesIcon className="mr-1 size-4" />
              转换
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => setInput(sample)}
            >
              示例
            </Button>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='粘贴 JSON 数据...'
            className="min-h-[400px] font-mono text-sm"
            rows={16}
          />
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">生成的 TypeScript 类型</span>
            {output && (
              <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 text-xs">
                {copied ? <CheckIcon className="mr-1 size-3" /> : <CopyIcon className="mr-1 size-3" />}
                {copied ? "已复制" : "复制"}
              </Button>
            )}
          </div>
          <pre
            className={[
              "min-h-[400px] overflow-auto rounded-md border bg-muted/50 p-4 font-mono text-sm whitespace-pre-wrap",
              !output && "flex items-center justify-center text-muted-foreground",
            ].join(" ")}
          >
            {output || "转换结果将显示在这里"}
          </pre>
        </div>
      </div>
    </main>
  )
}
