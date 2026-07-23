"use client"

import { useEffect, useState } from "react"
import { RadioIcon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface LiveData {
  live: boolean
  title?: string
  cover?: string
  url?: string
}

export function LiveBadge({ className }: { className?: string }) {
  const [data, setData] = useState<LiveData | null>(null)

  useEffect(() => {
    let cancelled = false

    const check = async () => {
      try {
        const res = await fetch("/api/live")
        const json = await res.json()
        if (!cancelled) setData(json)
      } catch {
        // silently fail
      }
    }

    check()
    const interval = setInterval(check, 60_000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  if (!data?.live) return null

  return (
    <a
      href={data.url ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "absolute top-1 right-1 z-10 flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white shadow-md animate-pulse hover:bg-red-600 transition-colors",
        className
      )}
    >
      <RadioIcon className="size-3" />
      直播中
    </a>
  )
}
