"use client"

import { useState, useMemo } from "react"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { CheckIcon, CopyIcon } from "lucide-react"
import { ToolPageHeader } from "@/components/ToolPageHeader"
import { diffLines } from "@/lib/line-diff"

function formatJson(obj: unknown, indent = 0): string[] {
  const pad = "  ".repeat(indent)
  if (obj === null) return [`${pad}null`]
  if (typeof obj !== "object") return [`${pad}${JSON.stringify(obj)}`]
  if (Array.isArray(obj)) {
    if (obj.length === 0) return [`${pad}[]`]
    const lines: string[] = [`${pad}[`]
    obj.forEach((item, i) => {
      const inner = formatJson(item, indent + 1)
      const last = inner.length - 1
      inner[last] = (inner[last] ?? "") + (i < obj.length - 1 ? "," : "")
      lines.push(...inner)
    })
    lines.push(`${pad}]`)
    return lines
  }
  const keys = Object.keys(obj)
  if (keys.length === 0) return [`${pad}{}`]
  const lines: string[] = [`${pad}{`]
  keys.forEach((key, i) => {
    const val = (obj as Record<string, unknown>)[key]
    const safeKey = /^[a-zA-Z_$][\w$]*$/.test(key) ? key : `"${key}"`
    const valueLines = formatJson(val, indent + 1)
    valueLines[0] = `${pad}  ${safeKey}: ${(valueLines[0] ?? "").trimStart()}`
    const last = valueLines.length - 1
    valueLines[last] = (valueLines[last] ?? "") + (i < keys.length - 1 ? "," : "")
    lines.push(...valueLines)
  })
  lines.push(`${pad}}`)
  return lines
}

function jsonDiff(a: unknown, b: unknown) {
  const result = diffLines(formatJson(a), formatJson(b))
  return { left: result.before, right: result.after }
}

const SAMPLE_A = `{
  "name": "张三",
  "age": 25,
  "email": "old@example.com",
  "address": {
    "city": "北京",
    "street": "长安街"
  },
  "tags": ["js", "css"]
}`

const SAMPLE_B = `{
  "name": "张三",
  "age": 26,
  "email": "new@example.com",
  "address": {
    "city": "上海",
    "street": "长安街",
    "zip": "200000"
  },
  "tags": ["js", "css", "html"]
}`

export default function JsonDiffPage() {
  const [inputA, setInputA] = useState("")
  const [inputB, setInputB] = useState("")
  const [copied, setCopied] = useState<"a" | "b" | null>(null)

  const result = useMemo(() => {
    if (!inputA.trim() || !inputB.trim()) return null
    try {
      const a = JSON.parse(inputA)
      const b = JSON.parse(inputB)
      return jsonDiff(a, b)
    } catch {
      return null
    }
  }, [inputA, inputB])

  const error = useMemo(() => {
    if (!inputA.trim() && !inputB.trim()) return ""
    try { if (inputA.trim()) JSON.parse(inputA) } catch (e) {
      return `JSON A 格式错误：${(e as SyntaxError).message}`
    }
    try { if (inputB.trim()) JSON.parse(inputB) } catch (e) {
      return `JSON B 格式错误：${(e as SyntaxError).message}`
    }
    return ""
  }, [inputA, inputB])

  const diffCount = result
    ? result.left.filter((l) => l.type !== "same").length +
      result.right.filter((l) => l.type !== "same").length
    : 0

  const loadSample = () => {
    setInputA(SAMPLE_A)
    setInputB(SAMPLE_B)
  }

  const handleCopy = (side: "a" | "b") => {
    const text = side === "a" ? inputA : inputB
    navigator.clipboard.writeText(text)
    setCopied(side)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-6 sm:pt-16 sm:pb-24">
      <ToolPageHeader
        title="JSON 对比"
        description="粘贴两个 JSON，逐行对比差异。绿色=新增，红色=删除"
        className="mb-6"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">JSON A（原始）</span>
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => handleCopy("a")}>
              {copied === "a" ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
            </Button>
          </div>
          <Textarea
            value={inputA}
            onChange={(e) => setInputA(e.target.value)}
            placeholder="粘贴 JSON..."
            className="min-h-[400px] font-mono text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">JSON B（对比）</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={loadSample}>
                示例
              </Button>
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => handleCopy("b")}>
                {copied === "b" ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
              </Button>
            </div>
          </div>
          <Textarea
            value={inputB}
            onChange={(e) => setInputB(e.target.value)}
            placeholder="粘贴 JSON..."
            className="min-h-[400px] font-mono text-sm"
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {result && (
        <>
          <p className="mt-4 text-xs text-muted-foreground">共 {diffCount} 处差异</p>
          <div className="mt-2 grid gap-4 lg:grid-cols-2">
            <pre className="overflow-auto rounded-md border bg-muted/30 p-4 font-mono text-xs leading-5 whitespace-pre">
              {result.left.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.type === "added"
                      ? "bg-green-500/10 border-l-2 border-green-500"
                      : line.type === "removed"
                        ? "bg-red-500/10 border-l-2 border-red-500"
                        : ""
                  }
                >
                  {line.placeholder ? "\xA0" : line.text}
                </div>
              ))}
            </pre>
            <pre className="overflow-auto rounded-md border bg-muted/30 p-4 font-mono text-xs leading-5 whitespace-pre">
              {result.right.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.type === "added"
                      ? "bg-green-500/10 border-l-2 border-green-500"
                      : line.type === "removed"
                        ? "bg-red-500/10 border-l-2 border-red-500"
                        : ""
                  }
                >
                  {line.placeholder ? "\xA0" : line.text}
                </div>
              ))}
            </pre>
          </div>
        </>
      )}
    </main>
  )
}
