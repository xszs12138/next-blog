export type MovieMeta = {
  slug: string
  title: string
  year: number
  rating?: number
  genres: string[]
  poster?: string
  watchedAt?: string
  description: string
}

export type MovieNavigationItem = Pick<MovieMeta, "slug" | "title">
