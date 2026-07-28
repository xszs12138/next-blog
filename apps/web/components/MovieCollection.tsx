"use client"

import { ClapperboardIcon, FilmIcon, StarIcon } from "lucide-react"

import LightRays from "@workspace/ui/components/LightRays"
import MagicBento, { type BentoCardProps } from "@/components/MagicBento"
import type { MovieMeta } from "@/lib/movie-types"

type MovieCollectionProps = {
  movies: MovieMeta[]
}

function toMovieCard(movie: MovieMeta): BentoCardProps {
  return {
    title: movie.title,
    label: `${movie.year || "—"} · ${movie.genres[0] ?? "电影"}`,
    meta: movie.rating === undefined ? "未评分" : `${movie.rating.toFixed(1)} / 10`,
    description: movie.description,
    poster: movie.poster,
    href: `/movies/${movie.slug}`,
  }
}

export function MovieCollection({ movies }: MovieCollectionProps) {
  const movieCards = movies.map(toMovieCard)

  return (
    <main className="relative isolate min-h-[calc(100svh-3.5rem)] overflow-hidden bg-background px-4 pt-10 pb-28 text-foreground dark:bg-[#100f0f] dark:text-stone-100 sm:px-6 sm:pt-16 sm:pb-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 hidden h-[30rem] overflow-hidden opacity-[0.24] mix-blend-screen [mask-image:linear-gradient(to_bottom,black_0%,black_52%,transparent_100%)] dark:block"
      >
        <LightRays
          raysOrigin="top-center"
          raysColor="#b7a57d"
          raysSpeed={0.14}
          lightSpread={1.65}
          rayLength={1.1}
          followMouse={false}
          mouseInfluence={0}
          noiseAmount={0.16}
          distortion={0.018}
          pulsating={false}
          fadeDistance={0.82}
          saturation={0.48}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_65%_34%_at_50%_0%,rgba(213,179,122,0.12),transparent_100%),linear-gradient(to_bottom,rgba(16,15,15,0.32),rgba(16,15,15,0.97)_52%)] dark:block"
      />

      <section className="relative z-10 mx-auto w-full max-w-7xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 border-y border-border py-2 text-[0.65rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase dark:border-white/15 dark:text-stone-400">
            <FilmIcon className="size-3.5" />
            观影档案
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-foreground dark:text-stone-100 sm:text-6xl">
            看过的电影
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground dark:text-stone-400 sm:text-base">
            留下那些让我在散场后，仍想把片尾字幕看完的故事。
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground dark:text-stone-400">
            <span className="inline-flex items-center gap-1.5">
              <ClapperboardIcon className="size-3.5" />
              {movies.length} 部记录
            </span>
            <span className="inline-flex items-center gap-1.5">
              <StarIcon className="size-3.5 fill-[#d6b37a] text-[#d6b37a]" />
              个人观影清单
            </span>
          </div>
        </header>

        <div className="mt-8 sm:mt-12">
          <MagicBento
            cards={movieCards}
            layout="grid"
            textAutoHide={false}
            enableStars
            enableSpotlight={false}
            enableBorderGlow
            particleCount={4}
            enableTilt
            clickEffect={false}
            enableMagnetism={false}
            glowColor="214, 179, 122"
          />
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-xs leading-6 text-muted-foreground dark:text-stone-500">
          每张卡片都由对应的 MDX 生成；点击卡片即可阅读完整观影笔记。
        </p>
      </section>
    </main>
  )
}
