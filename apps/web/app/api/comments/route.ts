import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { randomUUID } from "node:crypto"

// GET /api/comments?slug=xxx
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug")
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 })
  }

  const comments = db
    .prepare(
      `SELECT id, post_slug, user_id, user_name, user_image, content, parent_id, created_at
       FROM comments
       WHERE post_slug = ?
       ORDER BY created_at ASC`
    )
    .all(slug)

  return NextResponse.json(comments)
}

// POST /api/comments — { slug, content }
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { slug, content, parent_id } = await request.json()

  if (!slug || !content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  // Validate parent_id if provided
  if (parent_id) {
    const parent = db.prepare("SELECT id, post_slug FROM comments WHERE id = ?").get(parent_id) as { id: string; post_slug: string } | undefined
    if (!parent || parent.post_slug !== slug) {
      return NextResponse.json({ error: "Invalid parent comment" }, { status: 400 })
    }
  }

  const id = randomUUID()
  const now = new Date().toISOString()

  db.prepare(
    `INSERT INTO comments (id, post_slug, user_id, user_name, user_image, content, parent_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    slug,
    session.user.id,
    session.user.name || "Anonymous",
    session.user.image || null,
    content.trim(),
    parent_id || null,
    now
  )

  const comment = db.prepare("SELECT * FROM comments WHERE id = ?").get(id)

  return NextResponse.json(comment, { status: 201 })
}
