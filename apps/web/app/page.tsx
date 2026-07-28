import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowUpRightIcon,
  BookOpenIcon,
  ImageIcon,
  WrenchIcon,
} from "lucide-react"

import { HeroCloud, HeroShinyText } from "@/components/HeroWidgets"

export const metadata: Metadata = {
  title: "首页",
  description: "关于代码、游戏与日常工具的个人笔记。",
}

export default function Page() {
  return (
    <main className="relative isolate mx-auto flex min-h-[calc(100svh-3rem)] max-w-6xl flex-col justify-center overflow-hidden px-4 pt-10 pb-28 sm:px-6 sm:pt-16 sm:pb-32">
      <div
        aria-hidden="true"
        className="absolute top-[8%] left-[-12rem] -z-10 size-96 rounded-full bg-stone-300/25 blur-3xl dark:bg-stone-500/8"
      />
      <div
        aria-hidden="true"
        className="absolute right-[-10rem] bottom-[8%] -z-10 size-80 rounded-full bg-slate-300/20 blur-3xl dark:bg-slate-400/8"
      />

      <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-20">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <div className="inline-flex items-center gap-2 border-y border-border/80 py-2 text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            <span className="size-1.5 rounded-full bg-foreground/45" />
            个人随记 / 2026
          </div>

          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.065em] text-foreground sm:text-6xl lg:text-7xl">
            把零散的想法，
            <span className="block text-foreground/55">
              留成一页。
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-pretty text-base leading-7 text-muted-foreground sm:text-lg lg:mx-0">
            关于代码、游戏与日常工具的个人笔记。把一闪而过的灵感，慢慢做成值得回看的东西。
          </p>

          <div className="mt-6 opacity-80">
            <HeroShinyText />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background shadow-lg shadow-foreground/10 transition-transform duration-300 hover:-translate-y-0.5"
            >
              开始阅读
              <ArrowUpRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/55 px-5 py-3 text-sm font-medium text-foreground backdrop-blur transition-colors duration-300 hover:bg-muted"
            >
              探索工具箱
              <ArrowUpRightIcon className="size-4 text-muted-foreground" />
            </Link>
          </div>
        </div>

        <div className="order-1 mx-auto w-full max-w-[19rem] lg:order-2 lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border/80 bg-background/65 p-5 shadow-2xl shadow-foreground/10 backdrop-blur-sm">
            <div className="absolute inset-3 rounded-[1.5rem] border border-dashed border-foreground/15" />
            <p className="absolute top-6 left-7 text-[0.6rem] font-medium tracking-[0.2em] text-muted-foreground uppercase">
              Ahuya 的档案
            </p>
            <HeroCloud />
            <div className="absolute right-3 bottom-3 left-3 border-t border-border/80 bg-background/80 px-4 py-3 text-left backdrop-blur">
              <p className="text-[0.6rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                正在制作
              </p>
              <p className="mt-1 text-sm font-medium">代码、游戏与小工具</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="快速入口" className="mt-14 grid divide-y divide-border/80 border-y border-border/80 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:mt-16">
        <QuickLink
          index="01"
          href="/blog"
          icon={<BookOpenIcon className="size-4" />}
          title="随笔与技术"
          description="留住正在成形的想法"
        />
        <QuickLink
          index="02"
          href="/tools"
          icon={<WrenchIcon className="size-4" />}
          title="实用工具箱"
          description="把常用能力放在手边"
        />
        <QuickLink
          index="03"
          href="/gallery"
          icon={<ImageIcon className="size-4" />}
          title="灵感图库"
          description="收藏值得停留的画面"
        />
      </section>

      <footer className="mt-10 flex flex-col gap-3 border-t border-border/80 pt-5 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p>Next.js · Tailwind CSS</p>
        <p>部署于 Vercel · CDN 由 Cloudflare 提供</p>
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-foreground"
        >
          津ICP备2024017210号-1
        </a>
      </footer>
    </main>
  )
}

function QuickLink({
  index,
  href,
  icon,
  title,
  description,
}: {
  index: string
  href: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="group relative p-5 transition-colors duration-300 hover:bg-muted/45 sm:p-6"
    >
      <span className="text-[0.65rem] font-medium tracking-[0.16em] text-muted-foreground">
        {index}
      </span>
      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-muted-foreground">{icon}</span>
          <h2 className="font-medium">{title}</h2>
        </div>
        <ArrowUpRightIcon className="size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </Link>
  )
}
