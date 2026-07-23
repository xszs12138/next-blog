"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"

import type { PostMeta } from "@/lib/blog"
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@workspace/ui/components/command"

type PostSearchProps = {
  posts: PostMeta[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PostSearch({ posts, open, onOpenChange }: PostSearchProps) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const filtered = query
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.description.toLowerCase().includes(query.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          )
      )
    : posts

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="搜索文章"
      className="sm:max-w-lg md:max-w-xl"
    >
      <Command>
        <CommandInput
          placeholder="搜索文章标题、描述或标签..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>未找到相关文章</CommandEmpty>
          <CommandGroup heading="文章">
            {filtered.map((post) => (
              <CommandItem
                key={post.slug}
                value={`${post.title} ${post.tags.join(" ")}`}
                onSelect={() => {
                  router.push(`/blog/${post.slug}`)
                  onOpenChange(false)
                }}
              >
                <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="truncate">{post.title}</span>
                  {post.description && (
                    <span className="truncate text-xs text-muted-foreground">
                      {post.description}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
