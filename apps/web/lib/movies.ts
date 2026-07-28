import "server-only"

import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { cache } from "react"
import matter from "gray-matter"

import type { MovieMeta } from "@/lib/movie-types"

const moviesDirectory = path.resolve(process.cwd(), "content/movies")

type MovieSource = {
  source: string
  meta: MovieMeta
}

function getMoviePath(slug: string) {
  const moviePath = path.resolve(moviesDirectory, `${slug}.mdx`)
  const moviesPrefix = `${moviesDirectory}${path.sep}`
  return moviePath.startsWith(moviesPrefix) ? moviePath : null
}

function toNumber(value: unknown) {
  const number = typeof value === "number" ? value : Number(value)
  return Number.isFinite(number) ? number : undefined
}

function toStringArray(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean)
  return value ? [String(value)] : []
}

const getMovieSource = cache(async (slug: string): Promise<MovieSource | null> => {
  const moviePath = getMoviePath(slug)
  if (!moviePath) return null

  try {
    const source = await readFile(moviePath, "utf8")
    const { data } = matter(source)
    const year = toNumber(data.year)
    const rating = toNumber(data.rating)

    return {
      source,
      meta: {
        slug,
        title: data.title ? String(data.title) : slug,
        year: year ? Math.trunc(year) : 0,
        rating,
        genres: toStringArray(data.genres),
        poster: data.poster ? String(data.poster) : undefined,
        watchedAt: data.watchedAt ? String(data.watchedAt) : undefined,
        description: data.description ? String(data.description) : "",
      },
    }
  } catch {
    return null
  }
})

export const getAllMovies = cache(async (): Promise<MovieMeta[]> => {
  let files: string[]
  try {
    files = await readdir(moviesDirectory)
  } catch {
    return []
  }

  const sources = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => getMovieSource(file.replace(/\.mdx$/, "")))
  )

  return sources
    .flatMap((movie) => (movie ? [movie.meta] : []))
    .sort(
      (left, right) =>
        (right.watchedAt ?? "").localeCompare(left.watchedAt ?? "") ||
        right.year - left.year
    )
})

export async function getMovieMeta(slug: string): Promise<MovieMeta | null> {
  return (await getMovieSource(slug))?.meta ?? null
}
