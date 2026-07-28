export default function BangumiLoading() {
  return (
    <main className="mx-auto max-w-3xl px-4 pt-8 pb-20 sm:px-6 sm:pt-16 sm:pb-24">
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-32 rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex gap-3">
              <div className="h-28 w-20 shrink-0 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-3 w-16 rounded bg-muted" />
                <div className="h-3 w-24 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
