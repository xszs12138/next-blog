import type { Metadata } from "next"
import { BangumiWidget } from "@/components/BangumiWidget"
import { getBangumiCollections } from "@/lib/bangumi"

export const metadata: Metadata = {
  title: "番组",
  description: "我的番组收藏",
}

export default async function BangumiPage() {
  const collections = await getBangumiCollections().catch(() => null)

  return (
    <main className="mx-auto max-w-3xl px-4 pt-8 pb-20 sm:px-6 sm:pt-16 sm:pb-24">
      <BangumiWidget collections={collections} />
    </main>
  )
}
