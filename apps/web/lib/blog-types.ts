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
