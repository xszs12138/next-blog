import { db } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/views?slug=xxx
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug")
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 })
  }

  const row = db
    .prepare("SELECT count FROM page_views WHERE slug = ?")
    .get(slug) as { count: number } | undefined

  return NextResponse.json({ count: row?.count ?? 0 })
}

// POST /api/views — { slug }
export async function POST(request: NextRequest) {
  const { slug } = await request.json()
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 })
  }

  db.prepare(
    `INSERT INTO page_views (slug, count) VALUES (?, 1)
     ON CONFLICT(slug) DO UPDATE SET count = count + 1`
  ).run(slug)

  const row = db
    .prepare("SELECT count FROM page_views WHERE slug = ?")
    .get(slug) as { count: number }

  return NextResponse.json({ count: row.count })
}
