import { cn } from "../utils/tool";

export function PageContainer({ children, className }: { children?: React.ReactNode, className?: string }) {
  return (
    <div className={cn("z-0 min-h-svh w-full", className)}>
      {children}
    </div>
  )
}
