"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon, Share2Icon } from "lucide-react"

type ShareButtonProps = {
  url?: string
  title?: string
}

export function ShareButton({ url, title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "")
  const shareTitle = title ?? (typeof window !== "undefined" ? document.title : "")

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const platforms = [
    {
      name: "复制链接",
      icon: copied ? (
        <CheckIcon className="size-4 text-green-500" />
      ) : (
        <CopyIcon className="size-4" />
      ),
      onClick: handleCopy,
      active: copied,
    },
    {
      name: "X",
      icon: (
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
        </svg>
      ),
      onClick: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
          "_blank"
        )
      },
    },
    {
      name: "微博",
      icon: (
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
          <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.219c-.284.566-.987.97-1.596.92-.676-.055-1.073-.562-.9-1.19.153-.567.772-.973 1.446-1.006.638-.032 1.104.363 1.05.877v.399zm1.84-1.742c-.11.276-.423.448-.724.39-.326-.063-.518-.33-.43-.6.08-.255.38-.425.678-.386.312.04.528.294.476.596zm.744-4.637c-3.778-.313-7.102 1.247-7.423 3.483-.321 2.236 2.605 4.302 6.533 4.614 3.926.31 7.143-1.31 7.427-3.566.286-2.255-2.553-4.197-6.537-4.531z" />
          <path d="M20.392 5.573c.69.067 1.315.428 1.683.97.401.595.499 1.344.268 2.032-.27.81-.87 1.446-1.659 1.753-.723.282-1.539.238-2.168-.122-.692-.396-1.08-1.1-1.08-1.883 0-.9.485-1.73 1.266-2.181.637-.367 1.402-.464 2.09-.305-.062-.087-.124-.175-.19-.264h-.002zM17.931 6.665c.331.238.538.625.538 1.045 0 .508-.241.982-.642 1.268-.36.256-.84.325-1.272.183-.498-.164-.869-.611-.97-1.118-.095-.47.052-.97.39-1.317.345-.355.83-.53 1.326-.48.257.027.515.128.63.419z" />
        </svg>
      ),
      onClick: () => {
        window.open(
          `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`,
          "_blank"
        )
      },
    },
  ]

  return (
    <div className="not-prose my-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Share2Icon className="size-4" />
        <span>分享</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {platforms.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={p.onClick}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm transition-colors hover:bg-muted hover:text-foreground"
          >
            {p.icon}
            <span className={p.active ? "text-green-500" : ""}>
              {p.active ? "已复制" : p.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
