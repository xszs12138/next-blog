"use client"

import { useSession } from "@/lib/auth-client"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { CommentItem, type Comment } from "@/components/CommentItem"
import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"

type NestedComment = Comment & { children: NestedComment[] }

function nestComments(comments: Comment[]): NestedComment[] {
  const map = new Map<string, NestedComment>()
  const roots: NestedComment[] = []

  for (const c of comments) {
    map.set(c.id, { ...c, children: [] })
  }

  for (const c of comments) {
    const node = map.get(c.id)!
    if (c.parent_id && map.has(c.parent_id)) {
      map.get(c.parent_id)!.children.push(node)
    } else {
      roots.push(node)
    }
  }

  return roots
}

export function CommentSection({ slug }: { slug: string }) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?slug=${slug}`)
      if (res.ok) {
        setComments(await res.json())
      }
    } finally {
      setFetching(false)
    }
  }, [slug])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  useEffect(() => {
    if (session) {
      fetch("/api/admin")
        .then((res) => res.json())
        .then((data) => setIsAdmin(data.isAdmin))
        .catch(() => {})
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, content: content.trim() }),
      })
      if (res.ok) {
        const newComment = await res.json()
        setComments((prev) => [...prev, newComment])
        setContent("")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (
    parentId: string,
    parentUserName: string,
    rootParentId: string | null,
    content: string
  ) => {
    // Replying to a reply → flatten to root parent with @mention
    const actualParentId = rootParentId ?? parentId
    const actualContent = rootParentId
      ? `回复 @${parentUserName}: ${content}`
      : content

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, content: actualContent, parent_id: actualParentId }),
    })
    if (res.ok) {
      const newComment = await res.json()
      setComments((prev) => [...prev, newComment])
    } else {
      const err = await res.json().catch(() => ({ error: "Unknown error" }))
      console.error("Reply failed:", err)
      throw new Error(err.error || "回复失败")
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" })
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== id))
    }
  }

  const nested = useMemo(() => nestComments(comments), [comments])

  const renderComments = (items: NestedComment[]) => {
    return items.map((item) => (
      <CommentItem
        key={item.id}
        comment={item}
        isAdmin={isAdmin}
        onDelete={handleDelete}
        onReply={handleReply}
      >
        {item.children.length > 0 && renderComments(item.children)}
      </CommentItem>
    ))
  }

  return (
    <div className="mt-16 space-y-6">
      <h2 className="text-xl font-bold">
        评论{comments.length > 0 && ` (${comments.length})`}
      </h2>

      {/* Comment form */}
      {session ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>当前用户：{session.user.name}</span>
            <Link href="/settings" className="underline hover:text-foreground">
              编辑资料
            </Link>
          </div>
          <Textarea
            placeholder="写点什么..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <Button type="submit" disabled={loading || !content.trim()}>
            {loading ? "提交中..." : "发表评论"}
          </Button>
        </form>
      ) : (
        <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
          <Link href="/login" className="underline hover:text-foreground">
            登录
          </Link>
          {" "}后发表评论
        </div>
      )}

      {/* Comment list */}
      {fetching ? (
        <p className="text-sm text-muted-foreground">加载评论中...</p>
      ) : nested.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          还没有评论，来抢沙发！
        </p>
      ) : (
        <div className="space-y-3">{renderComments(nested)}</div>
      )}
    </div>
  )
}
