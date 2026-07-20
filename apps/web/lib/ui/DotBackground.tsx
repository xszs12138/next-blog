"use client"

import { cn } from "@workspace/ui/lib/utils"
import { DotPattern } from "@workspace/ui/components/dot-pattern"

export function DotPatternDemo() {
  return (
    <div className="absolute inset-0 z-0 h-svh w-screen">
      <DotPattern
        className={cn(
          "mask-[radial-gradient(100svh_circle_at_center,white,transparent)]"
        )}
      />
    </div>
  )
}
