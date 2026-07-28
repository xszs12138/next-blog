"use client"

import { useDeferredValue, useEffect, useRef, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"
import { useDocumentIsDark } from "@workspace/ui/hooks/use-document-is-dark"

type CodeEditorProps = {
  value: string
  onChange: (value: string) => void
  language: string
  placeholder: string
  ariaLabel: string
  className?: string
}

export function CodeEditor({
  value,
  onChange,
  language,
  placeholder,
  ariaLabel,
  className,
}: CodeEditorProps) {
  const deferredValue = useDeferredValue(value)
  const isDark = useDocumentIsDark()
  const highlightedLayerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [highlightedCode, setHighlightedCode] = useState("")

  function syncScroll(target: HTMLTextAreaElement) {
    const code = highlightedLayerRef.current?.querySelector("pre")
    if (code instanceof HTMLElement) {
      code.style.transform = `translate(${-target.scrollLeft}px, ${-target.scrollTop}px)`
    }
  }

  useEffect(() => {
    let active = true

    async function highlightCode() {
      if (!deferredValue) {
        setHighlightedCode("")
        return
      }

      try {
        const { codeToHtml } = await import("shiki")
        const html = await codeToHtml(deferredValue, {
          lang: language,
          theme: isDark ? "github-dark" : "github-light",
        })
        if (active) {
          setHighlightedCode(html)
          requestAnimationFrame(() => {
            if (active && textareaRef.current) syncScroll(textareaRef.current)
          })
        }
      } catch {
        if (active) setHighlightedCode("")
      }
    }

    void highlightCode()
    return () => {
      active = false
    }
  }, [deferredValue, isDark, language])

  return (
    <div
      className={cn(
        "relative min-h-72 overflow-hidden rounded-md border border-input bg-background font-mono text-sm leading-6 shadow-xs transition-shadow focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        className
      )}
    >
      <div
        ref={highlightedLayerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden [&>pre]:m-0 [&>pre]:min-h-full [&>pre]:min-w-full [&>pre]:overflow-visible [&>pre]:!bg-transparent [&>pre]:p-3 [&>pre]:font-mono [&>pre]:text-sm [&>pre]:leading-6 [&>pre>code]:font-mono [&>pre>code]:text-sm [&>pre>code]:leading-6"
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
      {!value && (
        <span className="pointer-events-none absolute top-3 left-3 text-muted-foreground">
          {placeholder}
        </span>
      )}
      <textarea
        ref={textareaRef}
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onScroll={(event) => syncScroll(event.currentTarget)}
        spellCheck={false}
        wrap="off"
        className="relative z-10 block min-h-72 w-full resize-y overflow-auto bg-transparent p-3 font-mono text-sm leading-6 text-transparent caret-foreground outline-none selection:bg-primary/25 selection:text-transparent"
      />
    </div>
  )
}
