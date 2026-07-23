"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

type CodeBlockProps = React.ComponentProps<"pre">

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = extractText(children)
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group/code relative mb-4">
      {/* macOS window controls */}
      <div className="flex items-center gap-1.5 rounded-t-lg border border-border bg-muted px-4 py-3">
        <span className="size-3 rounded-full bg-red-500" />
        <span className="size-3 rounded-full bg-yellow-500" />
        <span className="size-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-muted-foreground">
          {getLanguage(className)}
        </span>
        {/* Copy button */}
        <button
          type="button"
          onClick={handleCopy}
          className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground opacity-0 transition group-hover/code:opacity-100 hover:bg-muted-foreground/10"
        >
          {copied ? (
            <>
              <CheckIcon className="size-3" />
              已复制
            </>
          ) : (
            <>
              <CopyIcon className="size-3" />
              复制
            </>
          )}
        </button>
      </div>
      <pre
        className="overflow-x-auto rounded-b-lg border border-t-0 border-border bg-muted text-sm leading-relaxed"
        {...props}
      >
        {children}
      </pre>
    </div>
  )
}

function extractText(children: React.ReactNode): string {
  if (typeof children === "string") return children
  if (Array.isArray(children)) return children.map(extractText).join("")
  if (children && typeof children === "object" && "props" in children) {
    const props = children.props as Record<string, unknown>
    if (props.children) return extractText(props.children as React.ReactNode)
  }
  return ""
}

function getLanguage(className?: string): string {
  if (!className) return ""
  const match = className.match(/language-(\w+)/)
  return match?.[1] ?? ""
}
