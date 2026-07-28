import type { Metadata } from "next"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRightLeftIcon,
  BracesIcon,
  CloudSunIcon,
  Code2Icon,
  GlobeIcon,
  ImageIcon,
  Link2Icon,
  MapIcon,
  MapPinIcon,
  PaletteIcon,
  PenToolIcon,
} from "lucide-react"
import {
  TOOL_CATEGORIES,
  TOOL_FEATURES,
  type ToolCategoryId,
  type ToolFeature,
} from "@/lib/tool-catalog"

export const metadata: Metadata = {
  title: "在线功能",
  description: "无需登录、打开即可使用的在线功能集合",
}

const categoryIcons: Record<ToolCategoryId, LucideIcon> = {
  development: Code2Icon,
  design: PenToolIcon,
  network: GlobeIcon,
  resources: Link2Icon,
}

const featureIcons: Record<ToolFeature["href"], LucideIcon> = {
  "/tools/code-comparison": Code2Icon,
  "/tools/json-diff": ArrowRightLeftIcon,
  "/tools/json-to-ts": BracesIcon,
  "/tools/color": PaletteIcon,
  "/tools/watermark": ImageIcon,
  "/tools/ip-lookup": MapPinIcon,
  "/tools/map": MapIcon,
  "/tools/weather": CloudSunIcon,
  "/tools/websites": Link2Icon,
}

export default function ToolsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 pt-8 pb-11 sm:px-6">
      <header className="mb-10 border-b border-border pb-7 sm:mb-12">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          在线功能
        </h1>
      </header>

      <div className="space-y-10 sm:space-y-12">
        {TOOL_CATEGORIES.map((category) => {
          const CategoryIcon = categoryIcons[category.id]
          const features = TOOL_FEATURES.filter(
            (feature) => feature.categoryId === category.id
          )

          return (
            <section
              key={category.name}
              aria-labelledby={`feature-${category.index}`}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-xs font-medium tracking-[0.14em] text-muted-foreground">
                  {category.index}
                </span>
                <CategoryIcon className="size-4 text-muted-foreground" />
                <h2 id={`feature-${category.index}`} className="font-medium">
                  {category.name}
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {features.map((feature) => {
                  const FeatureIcon = featureIcons[feature.href]

                  return (
                    <Link
                      key={feature.href}
                      href={feature.href}
                      className="group rounded-xl border border-border bg-background/45 p-5 transition-colors duration-300 hover:bg-muted/45"
                    >
                      <FeatureIcon className="size-5 text-muted-foreground" />
                      <div className="mt-5 flex items-center justify-between gap-3">
                        <h3 className="font-medium">{feature.name}</h3>
                        <span className="text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5">
                          →
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {feature.description}
                      </p>
                    </Link>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
