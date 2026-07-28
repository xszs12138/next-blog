import type { Metadata } from "next"

import { getAllPosts } from "@/lib/blog"
import { BlogContent } from "@/components/BlogContent"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "博客",
  description: "阅读所有文章",
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  // Fetch all view counts (degrade gracefully if DB is unavailable)
  const slugs = posts.map((p) => p.slug)
  const views: Record<string, number> = {}
  if (slugs.length > 0) {
    try {
      const rows = await prisma.pageView.findMany({
        where: { slug: { in: slugs } },
        select: { slug: true, count: true },
      })
      for (const row of rows) {
        views[row.slug] = row.count
      }
    } catch (e) {
      console.error("Failed to fetch view counts:", e)
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 pt-8 pb-24 sm:px-6 sm:pt-16">
      <header className="mb-8 border-b border-border pb-7 sm:mb-10">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          文章归档
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              博客
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              记录开发、设计与日常思考。
            </p>
          </div>
          <span className="text-sm text-muted-foreground">
            共 {posts.length} 篇文章
          </span>
        </div>
      </header>

      <BlogContent posts={posts} views={views} />
    </main>
  )
}
