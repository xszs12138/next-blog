import type { Metadata } from "next"
import { BangumiWidget } from "@/components/BangumiWidget"
import { getBangumiCollections } from "@/lib/bangumi"

export const metadata: Metadata = {
  title: "番组",
  description: "我的番组收藏",
}

export default async function BangumiPage() {
  const collections = await getBangumiCollections().catch(() => null)

  return <BangumiWidget collections={collections} />
}
