import type { Metadata } from "next"

import { HeroCloud, HeroShinyText } from "@/components/HeroWidgets"

export const metadata: Metadata = {
  title: "Home",
  description: "Personal blog about tech, coding and more.",
}

export default function Page() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 pt-12 pb-20 sm:px-6 sm:pt-24 sm:pb-24">
      <HeroCloud />
      <HeroShinyText />
    </main>
  )
}
