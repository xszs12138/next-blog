"use client"

import { useState, useEffect, useCallback } from "react"
import { AnimatedThemeToggler } from "@workspace/ui/components/animated-theme-toggler"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

const floatingButtonClassName = cn(
  buttonVariants({ variant: "outline", size: "icon" }),
  "size-9 rounded-full shadow-md transition-all duration-300"
)

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
            floatingButtonClassName,
            showTop ? "scale-100 opacity-100" : "pointer-events-none scale-0 opacity-0"
          )}
          onClick={scrollToTop}
        >
          <ChevronUpIcon className="size-4" />
        </Button>

        <AnimatedThemeToggler
          aria-label="切换主题"
          className={floatingButtonClassName}
        />
      </div>

      <Button
        variant="outline"
        size="icon"
        className={floatingButtonClassName}
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
