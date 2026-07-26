"use client"

import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="min-h-svh bg-background text-foreground antialiased">
        <main className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-6 px-4 pt-32 pb-20 text-center sm:pt-40">
          <AlertTriangleIcon className="size-12 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">应用故障</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              出了严重错误，请刷新页面或稍后再试
            </p>
          </div>
          <Button variant="outline" onClick={reset}>
            <RefreshCwIcon className="size-4" />
            重试
          </Button>
        </main>
      </body>
    </html>
  )
}
