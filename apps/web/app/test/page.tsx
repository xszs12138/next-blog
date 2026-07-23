"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

const Lanyard = dynamic(() => import("@workspace/ui/components/Lanyard"), {
  ssr: false,
  loading: () => (
    <div className="flex h-svh items-center justify-center text-muted-foreground">
      Loading 3D...
    </div>
  ),
})

export default function TestPage() {
  return (
    <main className="-mt-12 h-svh">
      <Suspense
        fallback={
          <div className="flex h-svh items-center justify-center text-muted-foreground">
            Loading...
          </div>
        }
      >
        <Lanyard
          frontImage="https://bu.dusays.com/2026/02/15/69918a5bbfefa.webp"
          backImage="https://bu.dusays.com/2026/02/15/69918a5bbfefa.webp"
        />
      </Suspense>
    </main>
  )
}
