"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ClapperboardIcon, ExternalLinkIcon, StarIcon } from "lucide-react"

interface Subject {
  subject_id: number
  subject_type: number
  type: number
  rate: number
  updated_at: string
  subject: {
    name: string
    name_cn: string
    images: { medium: string; large: string }
    score: number
    type: number
    tags: Array<{ name: string; count: number }>
    date: string
  }
}

const TYPE_LABELS: Record<number, string> = {
  1: "想看",
  2: "看过",
  3: "在看",
  4: "搁置",
  5: "抛弃",
}

const TYPE_COLORS: Record<number, string> = {
  1: "bg-blue-500",
  2: "bg-green-500",
  3: "bg-amber-500",
  4: "bg-gray-400",
  5: "bg-red-500",
}

export function BangumiWidget() {
  const [items, setItems] = useState<Subject[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/bangumi")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setItems(json.data)
          setTotal(json.total)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-32 rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-28 w-20 shrink-0 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-3 w-16 rounded bg-muted" />
                <div className="h-3 w-24 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!items.length) return null

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <ClapperboardIcon className="size-5" />
        <h1 className="text-xl font-semibold">番组收藏</h1>
        <span className="text-sm text-muted-foreground">共 {total} 部</span>
        <Link
          href="https://bangumi.tv/user/681525"
          target="_blank"
          className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          Bangumi <ExternalLinkIcon className="size-3" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.subject_id}
            href={`https://bgm.tv/subject/${item.subject_id}`}
            target="_blank"
            className="group flex gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
          >
            <div className="relative shrink-0">
              <img
                src={item.subject.images.medium}
                alt={item.subject.name_cn || item.subject.name}
                className="h-32 w-24 rounded-md object-cover"
                loading="lazy"
              />
              <span
                className={[
                  "absolute top-1 left-1 rounded px-1.5 py-0.5 text-[10px] text-white",
                  TYPE_COLORS[item.type] ?? "bg-gray-500",
                ].join(" ")}
              >
                {TYPE_LABELS[item.type] ?? "?"}
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
              <div>
                <p className="font-medium text-sm line-clamp-2 group-hover:text-primary">
                  {item.subject.name_cn || item.subject.name}
                </p>
                {item.subject.name_cn && item.subject.name !== item.subject.name_cn && (
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                    {item.subject.name}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {item.subject.score > 0 && (
                  <span className="inline-flex items-center gap-0.5">
                    <StarIcon className="size-3 fill-amber-500 text-amber-500" />
                    {item.subject.score.toFixed(1)}
                  </span>
                )}
                {item.rate > 0 && (
                  <span>我的评分: {item.rate}</span>
                )}
                {item.subject.date && (
                  <span className="ml-auto">{item.subject.date.slice(0, 4)}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
