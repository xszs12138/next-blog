import { BlogSkeleton } from "@/components/BlogSkeleton"

export default function BlogLoading() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-16">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Blog
        </h1>
      </header>
      <BlogSkeleton />
    </main>
  )
}
