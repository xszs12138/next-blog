import { Skeleton } from "@workspace/ui/components/skeleton"

export function BlogSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border p-5">
          {/* Image skeleton */}
          <Skeleton className="mb-4 h-40 w-full rounded-lg" />
          {/* Date */}
          <Skeleton className="mb-2 h-3 w-24" />
          {/* Title */}
          <Skeleton className="mb-2 h-5 w-3/4" />
          {/* Description */}
          <Skeleton className="mb-3 h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          {/* Tags */}
          <div className="mt-3 flex gap-2">
            <Skeleton className="h-5 w-12 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}
