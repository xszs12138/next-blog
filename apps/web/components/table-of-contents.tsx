"use client"

import { type MouseEvent, useEffect, useState } from "react"

import type { TocItem } from "@/lib/blog"

type TableOfContentsProps = {
  items: TocItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id)

  function scrollToHeading(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault()

    const heading = document.getElementById(id)
    if (!heading) return

    window.scrollTo({
      top: heading.getBoundingClientRect().top + window.scrollY - 96,
      behavior: "smooth",
    })
    setActiveId(id)
  }

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => heading !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeading = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )[0]

        if (visibleHeading) setActiveId(visibleHeading.target.id)
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    )

    headings.forEach((heading) => observer.observe(heading))
    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <aside className="hidden w-64 shrink-0 xl:block">
      <nav
        aria-label={"\u6587\u7ae0\u76ee\u5f55"}
        className="sticky top-24 rounded-2xl border border-border/70 bg-background/75 p-4 shadow-xl shadow-black/10 backdrop-blur-xl"
      >
        <p className="mb-1 text-sm font-semibold tracking-tight">
          {"\u76ee\u5f55"}
        </p>
        <p className="mb-4 text-xs text-muted-foreground">
          {"\u5feb\u901f\u5b9a\u4f4d\u7ae0\u8282"}
        </p>

        <ol className="max-h-[calc(100svh-9rem)] space-y-1 overflow-y-auto pr-1 text-sm">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(event) => scrollToHeading(event, item.id)}
                aria-current={activeId === item.id ? "location" : undefined}
                title={item.text}
                style={{ paddingLeft: `${12 + (item.level - 2) * 12}px` }}
                className={
                  activeId === item.id
                    ? "relative block rounded-lg bg-foreground/10 py-2 pr-2 font-medium text-foreground before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-foreground"
                    : "block truncate rounded-lg py-2 pr-2 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                }
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  )
}
