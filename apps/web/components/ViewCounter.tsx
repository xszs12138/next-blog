"use client"

import { useEffect, useState } from "react"
import { EyeIcon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import CountUp from "@workspace/ui/components/CountUp"

export function ViewCounter({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/views`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setCount(data.count)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [slug])

  if (count === null) return null

  return (
    <span className={cn("inline-flex items-center gap-1 text-sm text-muted-foreground", className)}>
      <EyeIcon className="size-3.5" />
      <CountUp to={count} duration={1.5} />
    </span>
  )
}
