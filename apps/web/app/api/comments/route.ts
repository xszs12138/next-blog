import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function toCommentResponse(comment: {
  id: string
  postSlug: string
  userId: string
  userName: string
  userImage: string | null
  content: string
  parentId: string | null
  createdAt: Date
}) {
  return {
    id: comment.id,
    post_slug: comment.postSlug,
    user_id: comment.userId,
    user_name: comment.userName,
    user_image: comment.userImage,
    content: comment.content,
    parent_id: comment.parentId,
    created_at: comment.createdAt,
  }
}

// GET /api/comments?slug=xxx
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug")
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 })
  }

  const comments = await prisma.comment.findMany({
    where: { postSlug: slug },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json(comments.map(toCommentResponse))
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

  if (
    !slug ||
    !content ||
    typeof content !== "string" ||
    content.trim().length === 0
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  // Validate parent_id if provided
  if (parent_id) {
    const parent = await prisma.comment.findUnique({
      where: { id: parent_id },
      select: { postSlug: true },
    })
    if (!parent || parent.postSlug !== slug) {
      return NextResponse.json(
        { error: "Invalid parent comment" },
        { status: 400 }
      )
    }
  }

  const comment = await prisma.comment.create({
    data: {
      postSlug: slug,
      userId: session.user.id,
      userName: session.user.name || "Anonymous",
      userImage: session.user.image || null,
      content: content.trim(),
      parentId: parent_id || null,
    },
  })

  return NextResponse.json(toCommentResponse(comment), { status: 201 })
}
