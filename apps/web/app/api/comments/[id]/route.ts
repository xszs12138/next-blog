import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

// DELETE /api/comments/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const comment = db.prepare("SELECT * FROM comments WHERE id = ?").get(id) as {
    id: string
    user_id: string
  } | undefined

  if (!comment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Only the comment author or admin (first user) can delete
  // Admin = first user in the database (id = 1 in SQLite rowid)
  const firstUser = db.prepare(
    "SELECT id FROM user ORDER BY rowid ASC LIMIT 1"
  ).get() as { id: string } | undefined

  const isAdmin = firstUser?.id === session.user.id
  const isOwner = comment.user_id === session.user.id

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  db.prepare("DELETE FROM comments WHERE id = ?").run(id)

  return NextResponse.json({ success: true })
}
