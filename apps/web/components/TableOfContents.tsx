"use client"

import { useEffect, useRef, useState } from "react"

import type { TocItem } from "@/lib/blog-types"
import { Card } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"

type TableOfContentsProps = {
  items: TocItem[]
}

const SCROLL_OFFSET = 96
const SCROLL_STOP_DELAY = 150

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id)
  const pendingHeadingId = useRef<string | null>(null)
  const scrollStopTimeout = useRef<number | null>(null)

  function scrollToHeading(id: string) {
    const heading = document.getElementById(id)
    if (!heading) return

    if (scrollStopTimeout.current !== null) {
      window.clearTimeout(scrollStopTimeout.current)
      scrollStopTimeout.current = null
    }

    pendingHeadingId.current = id
    setActiveId(id)

    window.scrollTo({
      top: heading.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => heading !== null)

    if (headings.length === 0) return

    let animationFrame: number | null = null

    const getCurrentHeadingId = () => {
      const activationLine = window.scrollY + SCROLL_OFFSET + 1
      let currentId = headings[0]?.id

      for (const heading of headings) {
        const headingTop = heading.getBoundingClientRect().top + window.scrollY
        if (headingTop > activationLine) break
        currentId = heading.id
      }

      return currentId
    }

    const syncActiveHeading = () => {
      animationFrame = null

      const pendingId = pendingHeadingId.current
      if (pendingId) {
        const pendingHeading = document.getElementById(pendingId)
        const pendingTop = pendingHeading
          ? pendingHeading.getBoundingClientRect().top +
            window.scrollY -
            SCROLL_OFFSET
          : null

        if (pendingTop !== null && Math.abs(window.scrollY - pendingTop) > 2) {
          return
        }

        pendingHeadingId.current = null
      }

      const currentId = getCurrentHeadingId()
      if (currentId) {
        setActiveId((previousId) =>
          previousId === currentId ? previousId : currentId
        )
      }
    }

    const scheduleSync = () => {
      if (animationFrame !== null) return
      animationFrame = window.requestAnimationFrame(syncActiveHeading)
    }

    const handleScroll = () => {
      scheduleSync()

      if (!pendingHeadingId.current) return

      if (scrollStopTimeout.current !== null) {
        window.clearTimeout(scrollStopTimeout.current)
      }

      scrollStopTimeout.current = window.setTimeout(() => {
        pendingHeadingId.current = null
        scrollStopTimeout.current = null
        scheduleSync()
      }, SCROLL_STOP_DELAY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", scheduleSync)
    scheduleSync()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", scheduleSync)

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame)
      }
      if (scrollStopTimeout.current !== null) {
        window.clearTimeout(scrollStopTimeout.current)
        scrollStopTimeout.current = null
      }

      pendingHeadingId.current = null
    }
  }, [items])

  if (items.length === 0) return null

  return (
    <div className="hidden w-64 shrink-0 xl:block">
      <Card className="sticky top-15 rounded-2xl p-4">
        <nav aria-label="文章目录">
          <p className="mb-5 text-sm font-semibold tracking-tight">目录</p>
          <ol className="max-h-[calc(100svh-9rem)] space-y-1 overflow-y-auto pr-1 text-sm">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => scrollToHeading(item.id)}
                  aria-current={activeId === item.id ? "location" : undefined}
                  title={item.text}
                  style={{ paddingLeft: `${12 + (item.level - 2) * 12}px` }}
                  className={cn(
                    "w-full cursor-pointer truncate overflow-hidden text-left text-ellipsis! whitespace-nowrap",
                    activeId === item.id
                      ? "relative block rounded-lg px-2 py-1 font-medium before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-foreground"
                      : "block truncate rounded-lg py-1 pr-2 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  )}
                >
                  {item.text}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </Card>
    </div>
  )
}
