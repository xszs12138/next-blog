import { TableOfContents } from "@/components/table-of-contents"
import { getPostSlugs, getPostToc } from "@/lib/blog"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }))
}

export const dynamicParams = false

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const [{ default: Post }, toc] = await Promise.all([
    import(`@/content/${slug}.mdx`),
    getPostToc(slug),
  ])

  return (
    <main className="mx-auto flex w-full max-w-6xl gap-12 px-6 py-16">
      <article className="max-w-3xl min-w-0 flex-1 space-y-6">
        <Post />
      </article>
      <TableOfContents items={toc} />
    </main>
  )
}
