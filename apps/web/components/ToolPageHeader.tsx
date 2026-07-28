import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

type ToolPageHeaderProps = {
  title: string
  description: string
  className?: string
}

export function ToolPageHeader({
  title,
  description,
  className,
}: ToolPageHeaderProps) {
  return (
    <>
      <Link
        href="/tools"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3" />
        返回在线功能
      </Link>

      <header className={cn("mt-4 mb-8", className)}>
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </header>
    </>
  )
}
