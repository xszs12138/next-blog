import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"

import { getAllPosts } from "@/lib/blog"
import { Card } from "@workspace/ui/components/card"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

export const metadata: Metadata = {
  title: "Home",
  description: "Personal blog about tech, coding and more.",
}

export default async function Page() {
  const posts = await getAllPosts()
  const recentPosts = posts.slice(0, 5)

  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      {/* Hero */}
      <section className="mb-16">
        <h1 className="text-3xl font-bold tracking-tight">Hi, I&apos;m here.</h1>
        <p className="mt-4 max-w-lg text-muted-foreground leading-7">
          A developer who loves building things and sharing what I learn along the way.
        </p>
      </section>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Recent Posts</h2>
            <Link
              href="/blog"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "gap-1"
              )}
            >
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <Card className="p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1.5">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                      {post.description}
                    </p>
                  )}
                </Card>
              </Link>
            ))}
          </div>

          {posts.length === 0 && (
            <p className="text-sm text-muted-foreground">No posts yet.</p>
          )}
        </section>
      )}
    </main>
  )
}
