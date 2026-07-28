import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { CalendarIcon, PinIcon } from "lucide-react"

import { Card } from "@workspace/ui/components/card"
import { PixelImage } from "@workspace/ui/components/pixel-image"
import { TableOfContents } from "@/components/TableOfContents"
import { ShareButton } from "@/components/ShareButton"
import { LicenseNotice } from "@/components/LicenseNotice"
import { CommentSection } from "@/components/CommentSection"
import { ViewCounter } from "@/components/ViewCounter"
import {
  formatPostDate,
  getAllPosts,
  getPostMeta,
  getPostToc,
} from "@/lib/blog"

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
  const meta = await getPostMeta(slug)
  if (!meta) notFound()

  const [{ default: Post }, toc] = await Promise.all([
    import(`@/content/${slug}.mdx`),
    getPostToc(slug),
  ])

  return (
    <main className="mx-auto flex w-full max-w-6xl gap-6 px-4 pt-8 pb-20 sm:px-6 lg:gap-20 sm:pt-16 sm:pb-24">
      <article className="max-w-3xl min-w-0 flex-1">
        <Card className="p-6 sm:p-8">
          {/* Post header */}
          <header className="mb-6 sm:mb-8">
            {/* Cover image */}
            {meta.image && (
              <div className="relative -mx-6 -mt-6 mb-6 aspect-video w-[calc(100%+3rem)] overflow-hidden rounded-t-xl border-b border-border sm:-mx-8 sm:-mt-8 sm:mb-8 sm:w-[calc(100%+4rem)]">
                <PixelImage
                  src={meta.image}
                  className="absolute inset-0"
                  grid="8x8"
                />
              </div>
            )}

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {meta.title}
            </h1>
            {meta.description && (
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed sm:mt-3">
                {meta.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              {meta.date && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarIcon className="size-3.5" />
                  <time dateTime={meta.date}>{formatPostDate(meta.date)}</time>
                </div>
              )}
              <ViewCounter slug={slug} />
              {meta.pinned && (
                <span className="inline-flex items-center gap-0.5 text-sm text-rose-500">
                  <PinIcon className="size-3.5" />
                  置顶
                </span>
              )}
              {meta.tags.length > 0 && (
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

          <div className="border-b border-border pb-6 sm:pb-8" />

          {/* Post content */}
          <div className="prose-custom">
            <Post />
          </div>

          {/* Post footer */}
          <div className="mt-8 border-t border-border pt-6 sm:mt-10 sm:pt-8">
            <ShareButton />
            <LicenseNotice type="cc-by-nc-sa" author="xszs" />
          </div>

          <CommentSection slug={slug} />
        </Card>
      </article>

      <TableOfContents items={toc} />
    </main>
  )
}
