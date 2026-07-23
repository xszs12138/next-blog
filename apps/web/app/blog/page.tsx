import type { Metadata } from "next"

import { getAllPosts } from "@/lib/blog"
import { db } from "@/lib/db"
import { BlogContent } from "@/components/BlogContent"

export const metadata: Metadata = {
  title: "Blog",
  description: "阅读所有文章",
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  // Fetch all view counts
  const slugs = posts.map((p) => p.slug)
  const views: Record<string, number> = {}
  if (slugs.length > 0) {
    const rows = db
      .prepare(
        `SELECT slug, count FROM page_views WHERE slug IN (${slugs.map(() => "?").join(",")})`
      )
      .all(...slugs) as { slug: string; count: number }[]
    for (const row of rows) {
      views[row.slug] = row.count
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pt-8 pb-20 sm:px-6 sm:pt-16 sm:pb-24">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Blog
        </h1>
      </header>

      <BlogContent posts={posts} views={views} />
    </main>
  )
}
