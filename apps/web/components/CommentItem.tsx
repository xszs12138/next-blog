"use client"

import { useState } from "react"
import { useSession } from "@/lib/auth-client"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import Link from "next/link"

export interface Comment {
  id: string
  post_slug: string
  user_id: string
  user_name: string
  user_image: string | null
  content: string
  parent_id: string | null
  created_at: string
}

export function CommentItem({
  comment,
  children,
  isAdmin = false,
  onDelete,
  onReply,
}: {
  comment: Comment
  children?: React.ReactNode
  isAdmin?: boolean
  onDelete: (id: string) => Promise<void>
  onReply: (parentId: string, parentUserName: string, rootParentId: string | null, content: string) => Promise<void>
}) {
  const { data: session } = useSession()
  const isOwner = session?.user?.id === comment.user_id
  const showDelete = isOwner || isAdmin
  const [showReply, setShowReply] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [replying, setReplying] = useState(false)
  const [replyError, setReplyError] = useState("")
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(comment.id)
    } finally {
      setDeleting(false)
    }
  }

  const time = new Date(comment.created_at).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const handleReply = async () => {
    if (!replyContent.trim()) return
    setReplyError("")
    setReplying(true)
    try {
      await onReply(comment.id, comment.user_name, comment.parent_id || null, replyContent.trim())
      setReplyContent("")
      setShowReply(false)
    } catch (err) {
      setReplyError(err instanceof Error ? err.message : "回复失败")
    } finally {
      setReplying(false)
    }
  }

  return (
    <div>
      <div className="flex gap-3 rounded-lg border p-4">
        <img
          src={
            comment.user_image ||
            `https://avatar.vercel.sh/${comment.user_name}?size=40`
          }
          alt={comment.user_name}
          className="size-10 rounded-full"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{comment.user_name}</span>
            <span className="text-xs text-muted-foreground">{time}</span>
          </div>
          <p className="mt-1 text-sm whitespace-pre-wrap">{comment.content}</p>
          <div className="mt-2 flex gap-2">
            {session && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setShowReply(!showReply)}
              >
                回复
              </Button>
            )}
            {showDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground hover:text-red-500"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "..." : "删除"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Reply form */}
      {showReply && (
        <div className="ml-6 mt-2">
          {session ? (
            <div className="space-y-2">
              <Textarea
                placeholder={comment.parent_id ? `回复 @${comment.user_name}...` : `回复 ${comment.user_name}...`}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
                className="resize-none"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleReply} disabled={replying || !replyContent.trim()}>
                  {replying ? "..." : "回复"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowReply(false)}>
                  取消
                </Button>
              </div>
              {replyError && (
                <p className="text-xs text-red-500">{replyError}</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              <Link href="/login" className="underline">
                登录
              </Link>
              {" "}后回复
            </p>
          )}
        </div>
      )}

      {/* Child comments */}
      {children && <div className="ml-6 mt-2 space-y-3 border-l-2 border-border pl-4">{children}</div>}
    </div>
  )
}
