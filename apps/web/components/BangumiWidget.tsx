"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowUpRightIcon,
  ClapperboardIcon,
  EyeIcon,
  ListVideoIcon,
  Maximize2Icon,
  Minimize2Icon,
  StarIcon,
} from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import type { BangumiCollections, BangumiSubject } from "@/lib/bangumi"
import { NativeImageWithFallback } from "@/components/ImageWithFallback"
import styles from "./BangumiWidget.module.css"

const BACKGROUND_TRANSITION_DURATION = 900

const TYPE_LABELS: Record<number, string> = {
  1: "想看",
  2: "看过",
  3: "在看",
  4: "搁置",
  5: "抛弃",
}

const TYPE_COLORS: Record<number, string> = {
  1: "bg-sky-400",
  2: "bg-emerald-400",
  3: "bg-amber-300",
  4: "bg-stone-400",
  5: "bg-rose-400",
}

function getTitle(item: BangumiSubject) {
  return item.subject.name_cn || item.subject.name || "未命名条目"
}

function getCover(item: BangumiSubject) {
  return item.subject.images.large || item.subject.images.medium
}

function BangumiEmptyState() {
  return (
    <section className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center bg-stone-100 px-4 text-stone-900 dark:bg-[#0d0d0e] dark:text-stone-100">
      <div className="max-w-sm text-center">
        <ClapperboardIcon className="mx-auto size-8 text-stone-400 dark:text-stone-500" />
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">
          番组收藏暂不可用
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-500 dark:text-stone-400">
          稍后再试，或检查番组数据源配置。
        </p>
      </div>
    </section>
  )
}

export function BangumiWidget({
  collections,
}: {
  collections: BangumiCollections | null
}) {
  const items = collections?.data ?? []
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)
  const [slideId, setSlideId] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isCinemaMode, setIsCinemaMode] = useState(false)
  const stageRef = useRef<HTMLElement>(null)
  const selectedIndexRef = useRef(0)

  const selectItem = useCallback(
    (nextIndex: number) => {
      if (nextIndex < 0 || nextIndex >= items.length) return
      if (nextIndex === selectedIndexRef.current) return

      setPreviousIndex(selectedIndexRef.current)
      selectedIndexRef.current = nextIndex
      setSelectedIndex(nextIndex)
      setSlideId((current) => current + 1)
    },
    [items.length]
  )

  useEffect(() => {
    if (selectedIndexRef.current < items.length) return

    selectedIndexRef.current = 0
    setSelectedIndex(0)
    setPreviousIndex(null)
    setSlideId((current) => current + 1)
  }, [items.length])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updateMotionPreference()
    mediaQuery.addEventListener("change", updateMotionPreference)
    return () => mediaQuery.removeEventListener("change", updateMotionPreference)
  }, [])

  useEffect(() => {
    const updateCinemaMode = () => {
      setIsCinemaMode(document.fullscreenElement === stageRef.current)
    }

    updateCinemaMode()
    document.addEventListener("fullscreenchange", updateCinemaMode)
    return () => document.removeEventListener("fullscreenchange", updateCinemaMode)
  }, [])

  useEffect(() => {
    if (previousIndex === null) return

    const timeout = window.setTimeout(
      () => setPreviousIndex(null),
      BACKGROUND_TRANSITION_DURATION
    )
    return () => window.clearTimeout(timeout)
  }, [previousIndex])

  const toggleCinemaMode = useCallback(async () => {
    const stage = stageRef.current
    if (!stage) return

    try {
      if (document.fullscreenElement === stage) {
        await document.exitFullscreen()
      } else {
        await stage.requestFullscreen()
      }
    } catch {
      setIsCinemaMode(false)
    }
  }, [])

  const handleBackgroundAnimationEnd = useCallback(() => {
    if (items.length < 2 || prefersReducedMotion) return

    selectItem((selectedIndexRef.current + 1) % items.length)
  }, [items.length, prefersReducedMotion, selectItem])

  const selectedItem = items[selectedIndex] ?? items[0]

  if (!selectedItem) return <BangumiEmptyState />

  const title = getTitle(selectedItem)
  const originalTitle = selectedItem.subject.name
  const cover = getCover(selectedItem)
  const previousItem = previousIndex === null ? null : items[previousIndex]
  const statusLabel = TYPE_LABELS[selectedItem.type] ?? "收藏"
  const total = collections?.total ?? items.length

  return (
    <section
      ref={stageRef}
      className={cn(
        "relative isolate overflow-hidden bg-stone-100 text-stone-900 dark:bg-[#0d0d0e] dark:text-stone-100",
        isCinemaMode ? "h-svh" : "min-h-[calc(100svh-3.5rem)]"
      )}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {previousItem ? (
          <NativeImageWithFallback
            key={`previous-${previousItem.subject_id}-${slideId}`}
            src={getCover(previousItem)}
            alt=""
            containerClassName="absolute inset-0 opacity-50 dark:opacity-90"
            className={cn(
              "size-full object-cover object-[center_33%] brightness-105 grayscale-[0.1] saturate-[0.78] dark:brightness-110 dark:grayscale-[0.2]",
              styles.backgroundExit
            )}
            loading="eager"
          />
        ) : null}
        <NativeImageWithFallback
          key={`current-${selectedItem.subject_id}-${slideId}`}
          src={cover}
          alt=""
          containerClassName="absolute inset-0 opacity-50 dark:opacity-90"
          className={cn(
            "size-full object-cover object-[center_33%] brightness-105 grayscale-[0.1] saturate-[0.78] dark:brightness-110 dark:grayscale-[0.2]",
            styles.backgroundEnter
          )}
          onAnimationEnd={handleBackgroundAnimationEnd}
          loading="eager"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,245,244,0.98)_0%,rgba(245,245,244,0.89)_32%,rgba(245,245,244,0.38)_66%,rgba(245,245,244,0.7)_100%)] dark:bg-[linear-gradient(90deg,rgba(13,13,14,0.98)_0%,rgba(13,13,14,0.9)_34%,rgba(13,13,14,0.24)_68%,rgba(13,13,14,0.68)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_73%_20%,transparent_0%,rgba(28,25,23,0.05)_72%)] dark:bg-[radial-gradient(circle_at_73%_20%,transparent_0%,rgba(0,0,0,0.2)_72%)]" />
      </div>

      <div
        className={cn(
          "relative mx-auto flex w-full max-w-7xl flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-10",
          isCinemaMode ? "min-h-svh" : "min-h-[calc(100svh-3.5rem)]"
        )}
      >
        <header className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-stone-500 uppercase dark:text-stone-400">
            <ClapperboardIcon className="size-3.5" />
            番组收藏
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleCinemaMode}
              aria-pressed={isCinemaMode}
              aria-label={isCinemaMode ? "退出电影模式" : "进入电影模式"}
              title={isCinemaMode ? "退出电影模式" : "进入电影模式"}
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-900/10 bg-white/45 px-3 py-1.5 text-xs font-medium text-stone-600 backdrop-blur transition-colors hover:bg-white/75 hover:text-stone-950 dark:border-white/15 dark:bg-black/20 dark:text-stone-300 dark:hover:bg-black/35 dark:hover:text-white"
            >
              {isCinemaMode ? (
                <Minimize2Icon className="size-3.5" />
              ) : (
                <Maximize2Icon className="size-3.5" />
              )}
              <span className="hidden sm:inline">
                {isCinemaMode ? "退出电影模式" : "电影模式"}
              </span>
            </button>
            <Link
              href={`https://bgm.tv/subject/${selectedItem.subject_id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-900/10 bg-white/45 px-3 py-1.5 text-xs font-medium text-stone-600 backdrop-blur transition-colors hover:bg-white/75 hover:text-stone-950 dark:border-white/15 dark:bg-black/20 dark:text-stone-300 dark:hover:bg-black/35 dark:hover:text-white"
            >
              查看条目详情
              <ArrowUpRightIcon className="size-3" />
            </Link>
          </div>
        </header>

        <div className="relative flex flex-1 items-center py-14 sm:py-20 lg:py-24">
          <div
            key={`${selectedItem.subject_id}-${slideId}`}
            className={cn("max-w-2xl", styles.contentEnter)}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-stone-900/10 bg-white/45 px-3 py-1.5 text-xs text-stone-600 backdrop-blur dark:border-white/15 dark:bg-black/20 dark:text-stone-300">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  TYPE_COLORS[selectedItem.type] ?? "bg-stone-400"
                )}
              />
              {statusLabel}
              {selectedItem.subject.date ? (
                <span>· {selectedItem.subject.date.slice(0, 4)}</span>
              ) : null}
            </div>

            <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-[-0.055em] text-balance sm:text-5xl lg:text-7xl">
              {title}
            </h1>
            {originalTitle && originalTitle !== title ? (
              <p className="mt-3 max-w-lg text-sm tracking-wide text-stone-500 sm:text-base dark:text-stone-400">
                {originalTitle}
              </p>
            ) : null}

            <div className="mt-7 flex flex-wrap gap-2.5 text-sm text-stone-600 dark:text-stone-300">
              {selectedItem.subject.score > 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-900/10 bg-white/45 px-3 py-1.5 backdrop-blur dark:border-white/15 dark:bg-black/20">
                  <StarIcon className="size-3.5 fill-amber-400 text-amber-400" />
                  番组评分 {selectedItem.subject.score.toFixed(1)}
                </span>
              ) : null}
              {selectedItem.rate > 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-900/10 bg-white/45 px-3 py-1.5 backdrop-blur dark:border-white/15 dark:bg-black/20">
                  <EyeIcon className="size-3.5" />
                  我的评分 {selectedItem.rate}
                </span>
              ) : null}
            </div>

          </div>

        </div>

        <div className="relative -mx-4 mt-auto sm:-mx-6 lg:-mx-10">
          <div className="flex items-center justify-between px-4 pb-3 sm:px-6 lg:px-10">
            <p className="text-xs font-medium tracking-[0.16em] text-stone-500 uppercase dark:text-stone-400">
              作品轨道
            </p>
            <p className="text-xs text-stone-500 lg:hidden dark:text-stone-400">
              左右滑动切换
            </p>
          </div>
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-6 scrollbar-none sm:px-6 lg:px-10 [&::-webkit-scrollbar]:hidden">
            {items.map((item, index) => {
              const cardTitle = getTitle(item)
              const isSelected = index === selectedIndex

              return (
                <button
                  key={item.subject_id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => selectItem(index)}
                  className={cn(
                    "group relative h-40 w-28 shrink-0 snap-start overflow-hidden rounded-xl border text-left shadow-lg transition duration-300 sm:h-48 sm:w-36",
                    isSelected
                      ? "scale-[1.03] border-stone-900/70 ring-2 ring-stone-900/25 dark:border-white/80 dark:ring-white/20"
                      : "border-stone-900/10 opacity-75 hover:-translate-y-1 hover:opacity-100 dark:border-white/15"
                  )}
                >
                  <NativeImageWithFallback
                    src={item.subject.images.medium}
                    alt={cardTitle}
                    containerClassName="absolute inset-0"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent" />
                  <span
                    className={cn(
                      "absolute top-2 left-2 size-1.5 rounded-full",
                      TYPE_COLORS[item.type] ?? "bg-stone-400"
                    )}
                  />
                  <span className="absolute right-2 bottom-2 left-2 line-clamp-2 text-xs leading-4 font-medium text-white drop-shadow">
                    {cardTitle}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
