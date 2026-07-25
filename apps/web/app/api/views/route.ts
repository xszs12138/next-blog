import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/views?slug=xxx
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug")
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 })
  }

  const row = await prisma.pageView.findUnique({
    where: { slug },
    select: { count: true },
  })

  return NextResponse.json({ count: row?.count ?? 0 })
}

// POST /api/views — { slug }
export async function POST(request: NextRequest) {
  const { slug } = await request.json()
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 })
  }

  const row = await prisma.pageView.upsert({
    where: { slug },
    create: { slug, count: 1 },
    update: { count: { increment: 1 } },
    select: { count: true },
  })

  return NextResponse.json({ count: row.count })
}
