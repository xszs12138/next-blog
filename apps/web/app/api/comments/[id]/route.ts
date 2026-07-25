import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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

  const comment = await prisma.comment.findUnique({
    where: { id },
    select: { userId: true },
  })

  if (!comment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Only the comment author or admin (first user) can delete
  // Admin = first user in the database (id = 1 in SQLite rowid)
  const firstUser = await prisma.user.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  })

  const isAdmin = firstUser?.id === session.user.id
  const isOwner = comment.userId === session.user.id

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.comment.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
