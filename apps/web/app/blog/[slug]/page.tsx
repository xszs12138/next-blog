import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import { CalendarIcon, PinIcon } from "lucide-react"

import { TableOfContents } from "@/components/TableOfContents"
import { ShareButton } from "@/components/ShareButton"
import { LicenseNotice } from "@/components/LicenseNotice"
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
    <main className="mx-auto flex w-full max-w-6xl gap-6 px-4 pt-8 pb-20 sm:px-6 lg:gap-12 sm:pt-16 sm:pb-24">
      <article className="max-w-3xl min-w-0 flex-1">
        {/* Post header */}
        <header className="mb-6 sm:mb-8">
          {/* Cover image */}
          {meta?.image && (
            <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl border border-border sm:mb-8">
              <Image
                src={meta.image}
                alt={meta.title ?? slug}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 48rem"
                priority
              />
            </div>
          )}

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {meta?.title ?? slug}
          </h1>
          {meta?.description && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed sm:mt-3">
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
            {meta?.pinned && (
              <span className="inline-flex items-center gap-0.5 text-sm text-rose-500">
                <PinIcon className="size-3.5" />
                置顶
              </span>
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
      </article>

      <TableOfContents items={toc} />
    </main>
  )
}
