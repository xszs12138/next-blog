import type { Metadata } from "next"

import { MovieCollection } from "@/components/MovieCollection"
import { getAllMovies } from "@/lib/movies"

export const metadata: Metadata = {
  title: "看过的电影",
  description: "我的观影记录与片单短评",
}

export default async function MoviesPage() {
  const movies = await getAllMovies()

  return <MovieCollection movies={movies} />
}
