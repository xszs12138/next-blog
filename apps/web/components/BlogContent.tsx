"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { CalendarIcon, PinIcon, SearchIcon } from "lucide-react"

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

type BlogContentProps = {
  posts: PostMeta[]
}

export function BlogContent({ posts }: BlogContentProps) {
  const [query, setQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string>("all")

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

  return (
    <div>
      {/* Search + Filter */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索文章..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedTag} onValueChange={(v) => setSelectedTag(v ?? "all")}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="全部分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分类</SelectItem>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          未找到匹配的文章
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group"
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
                    </div>
                    <h3 className="mt-1 font-medium group-hover:text-primary transition-colors">
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
