import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { cache } from "react"
import matter from "gray-matter"
import GithubSlugger from "github-slugger"

export type PostMeta = {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  pinned: boolean
  image?: string
}

export type TocItem = {
  id: string
  level: number
  text: string
}

const contentDirectory = path.resolve(process.cwd(), "content")
const postDateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Shanghai",
})

type PostSource = {
  source: string
  meta: PostMeta
}

function getPostPath(slug: string) {
  const postPath = path.resolve(contentDirectory, `${slug}.mdx`)
  const contentPrefix = `${contentDirectory}${path.sep}`
  return postPath.startsWith(contentPrefix) ? postPath : null
}

const getPostSource = cache(async (slug: string): Promise<PostSource | null> => {
  const postPath = getPostPath(slug)
  if (!postPath) return null

  try {
    const source = await readFile(postPath, "utf8")
    const { data } = matter(source)

    return {
      source,
      meta: {
        slug,
        title: data.title ?? slug,
        date: data.date ? String(data.date) : "",
        description: data.description ?? "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        pinned: Boolean(data.pinned),
        image: data.image ? String(data.image) : undefined,
      },
    }
  } catch {
    return null
  }
})

export async function postExists(slug: string) {
  return (await getPostSource(slug)) !== null
}

export function formatPostDate(date: string) {
  return postDateFormatter.format(new Date(date))
}

/** Get all posts with frontmatter metadata, sorted by date descending */
export const getAllPosts = cache(async (): Promise<PostMeta[]> => {
  let files: string[]
  try {
    files = await readdir(contentDirectory)
  } catch {
    return []
  }

  const mdxFiles = files.filter((f) => f.endsWith(".mdx"))

  const sources = await Promise.all(
    mdxFiles.map((file) => getPostSource(file.replace(/\.mdx$/, "")))
  )
  const posts = sources.flatMap((post) => (post ? [post.meta] : []))

  return posts
    .filter((p) => p.date)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return b.date.localeCompare(a.date)
    })
})

/** Get a single post's frontmatter metadata */
export async function getPostMeta(slug: string): Promise<PostMeta | null> {
  return (await getPostSource(slug))?.meta ?? null
}

export async function getPostToc(slug: string): Promise<TocItem[]> {
  const post = await getPostSource(slug)
  if (!post) return []

  const slugger = new GithubSlugger()

  return post.source.split("\n").flatMap((line) => {
    const match = /^(#{2,6})\s+(.+?)\s*#*\s*$/.exec(line)

    if (!match) return []

    const hashes = match[1]
    const heading = match[2]
    if (!hashes || !heading) return []

    const text = stripMarkdown(heading)
    if (!text) return []

    return [{ id: slugger.slug(text), level: hashes.length, text }]
  })
}

function stripMarkdown(value: string) {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~]/g, "")
    .replace(/<[^>]+>/g, "")
    .trim()
}
