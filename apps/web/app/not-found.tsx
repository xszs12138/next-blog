import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { MagicCard } from "@workspace/ui/components/magic-card"

export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-24">
      <MagicCard
        className="w-full max-w-md rounded-2xl border border-border/80 bg-background shadow-sm"
        gradientOpacity={0.16}
      >
        <section className="p-7 sm:p-8">
          <p className="text-sm font-medium text-muted-foreground">404</p>
          <div className="mt-4 h-px w-12 bg-border" />
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">
            页面不存在
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            你访问的链接可能已失效，或者地址输入有误。
          </p>

          <div className="mt-8 flex items-center gap-5 text-sm font-medium">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-foreground transition-opacity hover:opacity-60"
            >
              返回首页
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/blog/1"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              阅读文章
            </Link>
          </div>
        </section>
      </MagicCard>
    </main>
  )
}
