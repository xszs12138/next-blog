"use client"

import { useState, useEffect, useCallback } from "react"
import { AnimatedThemeToggler } from "@workspace/ui/components/animated-theme-toggler"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

export function FloatingToolbar() {
  const [collapsed, setCollapsed] = useState(false)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <div className="fixed right-4 bottom-24 z-50 flex flex-col items-center gap-1.5">
      {/* Action buttons */}
      <div
        className={cn(
          "flex flex-col items-center gap-1.5 overflow-hidden transition-all duration-300",
          collapsed ? "h-0 opacity-0" : "opacity-100"
        )}
      >
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "size-9 rounded-full shadow-md transition-all duration-300",
            showTop ? "scale-100 opacity-100" : "pointer-events-none scale-0 opacity-0"
          )}
          onClick={scrollToTop}
        >
          <ChevronUpIcon className="size-4" />
        </Button>

        <div className="flex size-9 items-center justify-center rounded-full border bg-background shadow-md">
          <AnimatedThemeToggler />
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="size-9 rounded-full shadow-md"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronLeftIcon className="size-4" />
        ) : (
          <ChevronRightIcon className="size-4" />
        )}
      </Button>
    </div>
  )
}
