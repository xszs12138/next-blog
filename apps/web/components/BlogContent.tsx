"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowDownIcon, ArrowUpIcon, CalendarIcon, EyeIcon, PinIcon, SearchIcon } from "lucide-react"

import type { PostMeta } from "@/lib/blog"
import { Card } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"
import CountUp from "@workspace/ui/components/CountUp"

type BlogContentProps = {
  posts: PostMeta[]
  views?: Record<string, number>
}

export function BlogContent({ posts, views = {} }: BlogContentProps) {
  const [query, setQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "views">("date")
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [posts])

  const filtered = useMemo(() => {
    let result = posts

    if (selectedTag && selectedTag !== "all") {
      result = result.filter((p) => p.tags.includes(selectedTag))
    }

    if (query) {
      const q = query.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    return result
  }, [posts, query, selectedTag])

  const sorted = useMemo(() => {
    const list = [...filtered]
    list.sort((a, b) => {
      // Pinned always first
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      if (sortBy === "date") {
        const da = new Date(a.date).getTime()
        const db = new Date(b.date).getTime()
        return sortOrder === "desc" ? db - da : da - db
      }
      const va = views[a.slug] ?? 0
      const vb = views[b.slug] ?? 0
      return sortOrder === "desc" ? vb - va : va - vb
    })
    return list
  }, [filtered, sortBy, sortOrder, views])

  return (
    <div>
      {/* Search + Filter */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索文章..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={selectedTag}
          onValueChange={(v) => setSelectedTag(v ?? "all")}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="全部分类" />
          </SelectTrigger>
          <SelectContent side="bottom" align="start" sideOffset={6}>
            <SelectItem value="all">全部分类</SelectItem>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="mb-6 flex items-center justify-end gap-2">
        <button
          onClick={() => { setSortBy("date"); setSortOrder(sortBy === "date" ? (sortOrder === "desc" ? "asc" : "desc") : "desc") }}
          className={cn(
            "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs transition-colors",
            sortBy === "date"
              ? "border-primary/50 bg-primary/10 text-primary"
              : "border-border bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          <CalendarIcon className="size-3" />
          发布时间
          {sortBy === "date"
            ? (sortOrder === "desc" ? <ArrowDownIcon className="size-3" /> : <ArrowUpIcon className="size-3" />)
            : <ArrowDownIcon className="size-3 opacity-30" />}
        </button>
        <button
          onClick={() => { setSortBy("views"); setSortOrder(sortBy === "views" ? (sortOrder === "desc" ? "asc" : "desc") : "desc") }}
          className={cn(
            "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs transition-colors",
            sortBy === "views"
              ? "border-primary/50 bg-primary/10 text-primary"
              : "border-border bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          <EyeIcon className="size-3" />
          阅读量
          {sortBy === "views"
            ? (sortOrder === "desc" ? <ArrowDownIcon className="size-3" /> : <ArrowUpIcon className="size-3" />)
            : <ArrowDownIcon className="size-3 opacity-30" />}
        </button>
      </div>

      {/* Results */}
      {sorted.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          未找到匹配的文章
        </p>
      ) : (
        <div className="space-y-4">
          {sorted.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <Card className="overflow-hidden transition-colors hover:bg-muted/50">
                <div className="flex gap-2 sm:gap-4">
                  {/* Cover image */}
                  {post.image ? (
                    <div className="flex w-20 shrink-0 items-center p-1.5 sm:w-28 sm:p-2">
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="9rem"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-2 shrink-0 sm:w-3" />
                  )}
                  <div className="flex-1 py-2 pr-3 sm:py-3 sm:pr-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarIcon className="size-3" />
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString("zh-CN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      {post.pinned && (
                        <span className="inline-flex items-center gap-0.5 text-rose-500">
                          <PinIcon className="size-3" />
                          置顶
                        </span>
                      )}
                      {(() => {
                        const v = views[post.slug]
                        if (v && v > 0) {
                          return (
                            <span className="inline-flex items-center gap-1">
                              <EyeIcon className="size-3" />
                              <CountUp to={v} duration={0.3} />
                            </span>
                          )
                        }
                        return null
                      })()}
                    </div>
                    <h3 className="mt-1 font-medium transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                    {post.description && (
                      <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                        {post.description}
                      </p>
                    )}
                    {post.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className={cn(
                              "inline-flex items-center rounded-md border px-2 py-0.5 text-xs transition-colors",
                              selectedTag === tag
                                ? "border-primary/50 bg-primary/10 text-primary"
                                : "border-border text-muted-foreground"
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
