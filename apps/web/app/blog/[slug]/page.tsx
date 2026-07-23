import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { CalendarIcon } from "lucide-react"

import { TableOfContents } from "@/components/TableOfContents"
import { getPostToc, postExists, getAllPosts, getPostMeta } from "@/lib/blog"

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const meta = await getPostMeta(slug)

  if (!meta) {
    return { title: "未找到" }
  }

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      publishedTime: meta.date || undefined,
      tags: meta.tags,
    },
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  if (!(await postExists(slug))) notFound()

  const [{ default: Post }, toc, meta] = await Promise.all([
    import(`@/content/${slug}.mdx`),
    getPostToc(slug),
    getPostMeta(slug),
  ])

  return (
    <main className="mx-auto flex w-full max-w-6xl gap-12 px-6 py-16">
      <article className="max-w-3xl min-w-0 flex-1">
        {/* Post header */}
        <header className="mb-8 pb-8 border-b border-border">
          <h1 className="text-3xl font-bold tracking-tight">
            {meta?.title ?? slug}
          </h1>
          {meta?.description && (
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {meta.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            {meta?.date && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarIcon className="size-3.5" />
                <time dateTime={meta.date}>
                  {new Date(meta.date).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            )}
            {meta?.tags && meta.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Post content */}
        <div className="prose-custom">
          <Post />
        </div>
      </article>

      <TableOfContents items={toc} />
    </main>
  )
}
