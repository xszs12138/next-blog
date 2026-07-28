import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, CalendarDaysIcon, StarIcon } from "lucide-react"

import { getAllMovies, getMovieMeta } from "@/lib/movies"
import { ImageWithFallback } from "@/components/ImageWithFallback"

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const movies = await getAllMovies()
  return movies.map((movie) => ({ slug: movie.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const movie = await getMovieMeta(slug)

  if (!movie) return { title: "未找到电影笔记" }

  return {
    title: movie.title,
    description: movie.description,
    openGraph: {
      title: movie.title,
      description: movie.description,
      type: "article",
      images: movie.poster ? [{ url: movie.poster }] : undefined,
    },
  }
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { slug } = await params
  const movie = await getMovieMeta(slug)
  if (!movie) notFound()

  const { default: MovieReview } = await import(`@/content/movies/${slug}.mdx`)

  return (
    <main className="min-h-[calc(100svh-3.5rem)] bg-stone-50 px-4 py-10 text-stone-900 dark:bg-[#100f0f] dark:text-stone-100 sm:px-6 sm:py-16">
      <article className="mx-auto w-full max-w-5xl">
        <Link
          href="/movies"
          className="inline-flex items-center gap-2 text-sm text-stone-600 transition-colors hover:text-stone-950 dark:text-stone-400 dark:hover:text-white"
        >
          <ArrowLeftIcon className="size-4" />
          返回观影列表
        </Link>

        <header className="mt-6 grid gap-8 rounded-3xl border border-stone-200/80 bg-white/70 p-5 shadow-sm backdrop-blur sm:mt-8 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] sm:p-8 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="relative mx-auto aspect-[2/3] w-full max-w-xs overflow-hidden rounded-2xl bg-stone-200 shadow-2xl dark:bg-stone-800 sm:mx-0">
            {movie.poster ? (
              <ImageWithFallback
                src={movie.poster}
                alt={`${movie.title} 海报`}
                fill
                preload
                unoptimized
                containerClassName="absolute inset-0"
                sizes="(max-width: 639px) 80vw, 35vw"
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase dark:text-stone-400">
              观影笔记
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
              {movie.title}
            </h1>
            {movie.description ? (
              <p className="mt-5 max-w-xl leading-7 text-stone-600 dark:text-stone-300">
                {movie.description}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-stone-600 dark:text-stone-300">
              {movie.year ? <span>{movie.year}</span> : null}
              {movie.rating !== undefined ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 font-medium text-amber-800 dark:text-amber-200">
                  <StarIcon className="size-3.5 fill-current" />
                  {movie.rating.toFixed(1)} / 10
                </span>
              ) : null}
              {movie.watchedAt ? (
                <time className="inline-flex items-center gap-1.5" dateTime={movie.watchedAt}>
                  <CalendarDaysIcon className="size-3.5" />
                  观看于 {movie.watchedAt}
                </time>
              ) : null}
            </div>

            {movie.genres.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-xs text-stone-600 dark:border-white/10 dark:bg-white/5 dark:text-stone-300"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </header>

        <section className="prose-custom mx-auto mt-10 max-w-3xl border-t border-stone-200 pt-8 dark:border-white/10">
          <MovieReview />
        </section>
      </article>
    </main>
  )
}
