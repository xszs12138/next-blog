"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  EyeIcon,
  FileTextIcon,
  Grid2X2Icon,
  ListIcon,
  PinIcon,
  SearchIcon,
} from "lucide-react"

import type { PostMeta } from "@/lib/blog-types"
import { formatPostDate } from "@/lib/post-date"
import { Card } from "@workspace/ui/components/card"
import CountUp from "@workspace/ui/components/CountUp"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"
import { ImageWithFallback } from "@/components/ImageWithFallback"

type BlogContentProps = {
  posts: PostMeta[]
  views?: Record<string, number>
}

type Layout = "grid" | "list"

function PostMetaLine({
  post,
  views,
}: {
  post: PostMeta
  views: Record<string, number>
}) {
  const viewCount = views[post.slug]

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
      {post.pinned && (
        <span className="inline-flex items-center gap-1 text-foreground">
          <PinIcon className="size-3" />
          置顶
        </span>
      )}
      <span className="inline-flex items-center gap-1">
        <CalendarIcon className="size-3" />
        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      </span>
      {viewCount && viewCount > 0 ? (
        <span className="inline-flex items-center gap-1">
          <EyeIcon className="size-3" />
          <CountUp to={viewCount} duration={0.3} />
        </span>
      ) : null}
    </div>
  )
}

function PostTags({ post, selectedTag }: { post: PostMeta; selectedTag: string }) {
  if (post.tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {post.tags.map((tag) => (
        <span
          key={tag}
          className={cn(
            "inline-flex items-center rounded-md border px-2 py-0.5 text-xs transition-colors",
            selectedTag === tag
              ? "border-foreground/30 bg-foreground/10 text-foreground"
              : "border-border text-muted-foreground"
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

export function BlogContent({ posts, views = {} }: BlogContentProps) {
  const [query, setQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "views">("date")
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")
  const [layout, setLayout] = useState<Layout>("grid")

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)))
    return Array.from(tagSet).sort()
  }, [posts])

  const filtered = useMemo(() => {
    let result = posts

    if (selectedTag !== "all") {
      result = result.filter((post) => post.tags.includes(selectedTag))
    }

    if (query) {
      const normalizedQuery = query.toLowerCase()
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(normalizedQuery) ||
          post.description.toLowerCase().includes(normalizedQuery) ||
          post.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      )
    }

    return result
  }, [posts, query, selectedTag])

  const sorted = useMemo(() => {
    const list = [...filtered]
    list.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1

      if (sortBy === "date") {
        const aDate = new Date(a.date).getTime()
        const bDate = new Date(b.date).getTime()
        return sortOrder === "desc" ? bDate - aDate : aDate - bDate
      }

      const aViews = views[a.slug] ?? 0
      const bViews = views[b.slug] ?? 0
      return sortOrder === "desc" ? bViews - aViews : aViews - bViews
    })
    return list
  }, [filtered, sortBy, sortOrder, views])

  const toggleSort = (nextSort: "date" | "views") => {
    setSortBy(nextSort)
    setSortOrder((currentOrder) =>
      sortBy === nextSort ? (currentOrder === "desc" ? "asc" : "desc") : "desc"
    )
  }

  return (
    <div>
      <div className="mb-7 border-b border-border pb-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索文章..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-10 bg-background/55 pl-9"
            />
          </div>
          <Select
            value={selectedTag}
            onValueChange={(value) => setSelectedTag(value ?? "all")}
          >
            <SelectTrigger className="h-10 w-full bg-background/55 sm:w-44">
              <SelectValue placeholder="全部分类" />
            </SelectTrigger>
            <SelectContent side="bottom" align="end" sideOffset={6}>
              <SelectItem value="all">全部分类</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {sorted.length} 篇匹配文章
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border bg-background/55 p-1">
              <button
                type="button"
                onClick={() => setLayout("grid")}
                aria-label="切换为网格布局"
                aria-pressed={layout === "grid"}
                className={cn(
                  "inline-flex size-7 items-center justify-center rounded-md transition-colors",
                  layout === "grid"
                    ? "bg-muted text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Grid2X2Icon className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setLayout("list")}
                aria-label="切换为列表布局"
                aria-pressed={layout === "list"}
                className={cn(
                  "inline-flex size-7 items-center justify-center rounded-md transition-colors",
                  layout === "list"
                    ? "bg-muted text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <ListIcon className="size-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => toggleSort("date")}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs transition-colors",
                sortBy === "date"
                  ? "border-foreground/25 bg-foreground/10 text-foreground"
                  : "border-border bg-background/55 text-muted-foreground hover:text-foreground"
              )}
            >
              <CalendarIcon className="size-3" />
              时间
              {sortBy === "date" && sortOrder === "asc" ? (
                <ArrowUpIcon className="size-3" />
              ) : (
                <ArrowDownIcon className="size-3" />
              )}
            </button>
            <button
              type="button"
              onClick={() => toggleSort("views")}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs transition-colors",
                sortBy === "views"
                  ? "border-foreground/25 bg-foreground/10 text-foreground"
                  : "border-border bg-background/55 text-muted-foreground hover:text-foreground"
              )}
            >
              <EyeIcon className="size-3" />
              阅读
              {sortBy === "views" && sortOrder === "asc" ? (
                <ArrowUpIcon className="size-3" />
              ) : (
                <ArrowDownIcon className="size-3" />
              )}
            </button>
          </div>
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          未找到匹配的文章
        </p>
      ) : layout === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {sorted.map((post, index) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <Card className="h-full gap-0 p-0 transition-colors duration-300 hover:bg-muted/45">
                {post.image ? (
                  <div className="relative aspect-[16/9] overflow-hidden border-b border-border">
                    <ImageWithFallback
                      src={post.image}
                      alt={post.title}
                      fill
                      unoptimized
                      containerClassName="absolute inset-0"
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/9] items-end justify-between border-b border-border bg-muted/30 p-5 text-muted-foreground">
                    <FileTextIcon className="size-5" />
                    <span className="font-mono text-xs">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <PostMetaLine post={post} views={views} />
                  <h2 className="mt-3 text-lg font-medium tracking-tight transition-colors group-hover:text-foreground">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {post.description}
                    </p>
                  )}
                  <div className="mt-auto pt-5">
                    <PostTags post={post} selectedTag={selectedTag} />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((post, index) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <Card className="gap-0 p-0 transition-colors duration-300 hover:bg-muted/45">
                <div className="flex min-h-36">
                  {post.image ? (
                    <div className="relative hidden w-44 shrink-0 overflow-hidden border-r border-border sm:block">
                      <ImageWithFallback
                        src={post.image}
                        alt=""
                        fill
                        unoptimized
                        containerClassName="absolute inset-0"
                        sizes="11rem"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                      />
                    </div>
                  ) : (
                    <div className="hidden w-16 shrink-0 items-center justify-center border-r border-border bg-muted/30 font-mono text-xs text-muted-foreground sm:flex">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <PostMetaLine post={post} views={views} />
                        <h2 className="mt-2 text-base font-medium transition-colors group-hover:text-foreground sm:text-lg">
                          {post.title}
                        </h2>
                      </div>
                      <span className="text-sm text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5">
                        →
                      </span>
                    </div>
                    {post.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {post.description}
                      </p>
                    )}
                    <div className="mt-auto pt-4">
                      <PostTags post={post} selectedTag={selectedTag} />
                    </div>
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
