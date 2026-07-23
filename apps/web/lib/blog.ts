import { access, readFile, readdir } from "node:fs/promises"
import path from "node:path"
import matter from "gray-matter"
import GithubSlugger from "github-slugger"

export type PostMeta = {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
}

export type TocItem = {
  id: string
  level: number
  text: string
}

const contentDirectory = path.resolve(process.cwd(), "content")

function getPostPath(slug: string) {
  const postPath = path.resolve(contentDirectory, `${slug}.mdx`)
  const contentPrefix = `${contentDirectory}${path.sep}`
  return postPath.startsWith(contentPrefix) ? postPath : null
}

export async function postExists(slug: string) {
  const postPath = getPostPath(slug)
  if (!postPath) return false

  try {
    await access(postPath)
    return true
  } catch {
    return false
  }
}

/** Get all posts with frontmatter metadata, sorted by date descending */
export async function getAllPosts(): Promise<PostMeta[]> {
  let files: string[]
  try {
    files = await readdir(contentDirectory)
  } catch {
    return []
  }

  const mdxFiles = files.filter((f) => f.endsWith(".mdx"))

  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "")
      const filePath = path.resolve(contentDirectory, file)
      const source = await readFile(filePath, "utf8")
      const { data } = matter(source)

      return {
        slug,
        title: data.title ?? slug,
        date: data.date ? String(data.date) : "",
        description: data.description ?? "",
        tags: Array.isArray(data.tags) ? data.tags : [],
      } satisfies PostMeta
    })
  )

  return posts
    .filter((p) => p.date)
    .sort((a, b) => b.date.localeCompare(a.date))
}

/** Get a single post's frontmatter metadata */
export async function getPostMeta(slug: string): Promise<PostMeta | null> {
  const postPath = getPostPath(slug)
  if (!postPath) return null

  try {
    const source = await readFile(postPath, "utf8")
    const { data } = matter(source)

    return {
      slug,
      title: data.title ?? slug,
      date: data.date ? String(data.date) : "",
      description: data.description ?? "",
      tags: Array.isArray(data.tags) ? data.tags : [],
    }
  } catch {
    return null
  }
}

export async function getPostToc(slug: string): Promise<TocItem[]> {
  const postPath = getPostPath(slug)
  if (!postPath) return []

  const source = await readFile(postPath, "utf8")
  const slugger = new GithubSlugger()

  return source.split("\n").flatMap((line) => {
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
