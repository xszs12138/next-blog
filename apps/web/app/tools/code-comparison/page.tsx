"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { ArrowRightLeftIcon, Code2Icon, PlayIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { CodeEditor } from "@workspace/ui/components/code-editor"
import { ToolPageHeader } from "@/components/ToolPageHeader"
import {
  CODE_LANGUAGE_OPTIONS,
  type CodeLanguage,
} from "@/lib/code-language"
import { diffText, type DiffLine, type LineDiff } from "@/lib/line-diff"

const CodeComparison = dynamic(
  () =>
    import("@workspace/ui/components/code-comparison").then(
      (module) => module.CodeComparison
    ),
  {
    ssr: false,
    loading: () => <div className="h-72 animate-pulse rounded-xl border bg-muted/30" />,
  }
)

type Comparison = {
  diff: LineDiff
}

const SAMPLE_BEFORE = `export function formatPrice(value: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
  }).format(value)
}`

const SAMPLE_AFTER = `export function formatPrice(value: number, locale = "zh-CN") {
  if (!Number.isFinite(value)) return "—"

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }).format(value)
}`

function withDiffNotation(
  line: DiffLine,
  language: CodeLanguage,
  change: "added" | "removed"
) {
  if (line.placeholder || line.type !== change) return line.text

  const { comment } = CODE_LANGUAGE_OPTIONS[language]
  const notation = `[!code ${change === "added" ? "++" : "--"}]`

  if (comment === "/*") return `${line.text} /* ${notation} */`
  if (comment === "<!--") return `${line.text} <!-- ${notation} -->`
  return `${line.text} ${comment} ${notation}`
}

function getAnnotatedCode(
  lines: DiffLine[],
  language: CodeLanguage,
  change: "added" | "removed"
) {
  return lines
    .map((line) => withDiffNotation(line, language, change))
    .join("\n")
}

export default function CodeComparisonPage() {
  const [language, setLanguage] = useState<CodeLanguage>("typescript")
  const [beforeCode, setBeforeCode] = useState("")
  const [afterCode, setAfterCode] = useState("")
  const [comparison, setComparison] = useState<Comparison | null>(null)
  const [error, setError] = useState("")

  const analyze = () => {
    if (!beforeCode.trim() || !afterCode.trim()) {
      setError("请先填写修改前和修改后的代码。")
      setComparison(null)
      return
    }

    setError("")
    setComparison({
      diff: diffText(beforeCode, afterCode),
    })
  }

  const loadSample = () => {
    setLanguage("typescript")
    setBeforeCode(SAMPLE_BEFORE)
    setAfterCode(SAMPLE_AFTER)
    setError("")
    setComparison({
      diff: diffText(SAMPLE_BEFORE, SAMPLE_AFTER),
    })
  }

  const changeLanguage = (nextLanguage: CodeLanguage) => {
    setLanguage(nextLanguage)
    setComparison(null)
    setError("")
  }

  const reset = () => {
    setBeforeCode("")
    setAfterCode("")
    setComparison(null)
    setError("")
  }

  const annotatedBefore = comparison
    ? getAnnotatedCode(comparison.diff.before, language, "removed")
    : ""
  const annotatedAfter = comparison
    ? getAnnotatedCode(comparison.diff.after, language, "added")
    : ""

  return (
    <main className="mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-6 sm:pt-16 sm:pb-24">
      <ToolPageHeader
        title="代码对比分析"
        description="逐行分析两段代码的新增和删除；JSON 请使用专用的 JSON 对比。"
        className="mb-6"
      />

      <section className="rounded-xl border border-border bg-background/45 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:w-52">
            <label className="space-y-1.5 text-sm font-medium">
              <span>语言</span>
              <select
                value={language}
                onChange={(event) => changeLanguage(event.target.value as CodeLanguage)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {Object.entries(CODE_LANGUAGE_OPTIONS).map(([value, option]) => (
                  <option key={value} value={value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={loadSample}>
              <Code2Icon className="size-3.5" />
              示例
            </Button>
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcwIcon className="size-3.5" />
              清空
            </Button>
            <Button size="sm" onClick={analyze}>
              <PlayIcon className="size-3.5" />
              分析差异
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs text-muted-foreground">修改前</span>
            <CodeEditor
              value={beforeCode}
              onChange={(value) => {
                setBeforeCode(value)
                setComparison(null)
                setError("")
              }}
              placeholder="粘贴原始代码…"
              ariaLabel="修改前代码"
              language={language}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs text-muted-foreground">修改后</span>
            <CodeEditor
              value={afterCode}
              onChange={(value) => {
                setAfterCode(value)
                setComparison(null)
                setError("")
              }}
              placeholder="粘贴修改后的代码…"
              ariaLabel="修改后代码"
              language={language}
            />
          </label>
        </div>
      </section>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {comparison && (
        <section className="mt-6">
          <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <ArrowRightLeftIcon className="size-4" />
              对比结果
            </span>
          </div>
          <CodeComparison
            beforeCode={annotatedBefore}
            afterCode={annotatedAfter}
            language={language}
            label={CODE_LANGUAGE_OPTIONS[language].label}
            lightTheme="github-light"
            darkTheme="github-dark"
          />
        </section>
      )}
    </main>
  )
}
