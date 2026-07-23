import { Skeleton } from "@workspace/ui/components/skeleton"

export default function PostLoading() {
  return (
    <main className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:gap-12 sm:py-16">
      <article className="max-w-3xl min-w-0 flex-1">
        {/* Cover image skeleton */}
        <Skeleton className="mb-6 aspect-video w-full rounded-xl sm:mb-8" />

        {/* Title */}
        <Skeleton className="mb-3 h-8 w-3/4 sm:h-9" />

        {/* Description */}
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-2/3" />

        {/* Meta */}
        <div className="mb-6 flex gap-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-5 w-12 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>

        <Skeleton className="mb-2 h-px w-full" />

        {/* Content */}
        <div className="mt-8 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="mt-6 h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </article>
    </main>
  )
}
