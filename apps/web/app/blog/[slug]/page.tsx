import { notFound } from "next/navigation"

import { TableOfContents } from "@/components/table-of-contents"
import { getPostToc, postExists } from "@/lib/blog"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  if (!(await postExists(slug))) notFound()

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
