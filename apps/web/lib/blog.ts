import { readFile } from "node:fs/promises"
import path from "node:path"

import GithubSlugger from "github-slugger"

export type TocItem = {
  id: string
  level: number
  text: string
}

const posts = ["1"] as const

export function getPostSlugs() {
  return posts
}

export async function getPostToc(slug: string): Promise<TocItem[]> {
  const source = await readFile(
    path.join(process.cwd(), "content", `${slug}.mdx`),
    "utf8"
  )
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
