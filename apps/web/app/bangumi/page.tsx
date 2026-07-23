import type { Metadata } from "next"
import { BangumiWidget } from "@/components/BangumiWidget"

export const metadata: Metadata = {
  title: "Bangumi",
  description: "我的番组收藏",
}

export default function BangumiPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pt-8 pb-20 sm:px-6 sm:pt-16 sm:pb-24">
      <BangumiWidget />
    </main>
  )
}
