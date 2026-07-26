"use client"

import { useEffect } from "react"
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-6 px-4 pt-32 pb-20 text-center sm:pt-40">
      <AlertTriangleIcon className="size-12 text-muted-foreground" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">出错了</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          页面加载时发生了意外错误，请稍后重试
        </p>
      </div>
      <Button variant="outline" onClick={reset}>
        <RefreshCwIcon className="size-4" />
        重试
      </Button>
    </main>
  )
}
