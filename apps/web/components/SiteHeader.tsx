"use client"

import { Fragment, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PanelBottomOpenIcon, SearchIcon } from "lucide-react"

import type { PostMeta } from "@/lib/blog"
import {
  MEDIA_NAVIGATION_ITEMS,
  PRIMARY_NAVIGATION_ITEMS,
  ROUTE_LABELS,
  TOOL_NAVIGATION_ITEMS,
} from "@/lib/navigation"
import { PostSearch } from "@/components/PostSearch"
import { Button } from "@workspace/ui/components/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@workspace/ui/components/navigation-menu"
import { cn } from "@workspace/ui/lib/utils"

type NavigationMode = "header" | "dock"

type SiteHeaderProps = {
  posts: PostMeta[]
  mode: NavigationMode
  onModeChange: (mode: NavigationMode) => void
}

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname.startsWith(href)
}

function NavigationMenuGroup({
  active,
  items,
  label,
}: {
  active: boolean
  items: typeof TOOL_NAVIGATION_ITEMS
  label: string
}) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className={cn("text-sm", active && "bg-muted/60")}>
        {label}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="w-72 space-y-1 p-1">
          {items.map((item) => {
            const Icon = item.icon

            return (
              <li key={item.href}>
                <NavigationMenuLink render={<Link href={item.href} />}>
                  <Icon className="size-4 text-muted-foreground" />
                  <span>
                    <span className="block font-medium">{item.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                </NavigationMenuLink>
              </li>
            )
          })}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}

export function SiteHeader({ posts, mode, onModeChange }: SiteHeaderProps) {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const segments = pathname.split("/").filter(Boolean)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setSearchOpen((open) => !open)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/80 bg-background/88 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="返回首页">
            <Image
              src="https://bu.dusays.com/2026/02/15/69918a5bbfefa.webp"
              alt="Avatar"
              width={30}
              height={30}
              unoptimized
              className="size-7 rounded-full object-cover ring-1 ring-border"
            />
            {mode === "header" && (
              <span className="hidden text-sm font-medium sm:inline">Home</span>
            )}
          </Link>

          {mode === "header" ? (
            <>
              <NavigationMenu className="ml-auto hidden md:flex">
                <NavigationMenuList className="gap-2 lg:gap-4">
                  {PRIMARY_NAVIGATION_ITEMS.map((item) => (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuLink
                        render={<Link href={item.href} />}
                        data-active={isActivePath(pathname, item.href) || undefined}
                        className="px-2.5 text-sm data-active:bg-muted/60"
                      >
                        {item.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                  <NavigationMenuGroup
                    active={TOOL_NAVIGATION_ITEMS.some((item) => isActivePath(pathname, item.href))}
                    items={TOOL_NAVIGATION_ITEMS}
                    label="工具"
                  />
                  <NavigationMenuGroup
                    active={MEDIA_NAVIGATION_ITEMS.some((item) => isActivePath(pathname, item.href))}
                    items={MEDIA_NAVIGATION_ITEMS}
                    label="收藏"
                  />
                </NavigationMenuList>
              </NavigationMenu>
            </>
          ) : (
            <div className="min-w-0 flex-1 overflow-hidden">
              <Breadcrumb>
                <BreadcrumbList className="flex-nowrap overflow-hidden text-xs">
                  {segments.map((segment, index) => {
                    const href = `/${segments.slice(0, index + 1).join("/")}`
                    const isLast = index === segments.length - 1
                    const post = posts.find((item) => `/blog/${item.slug}` === href)
                    const label = ROUTE_LABELS[href] ?? post?.title ?? decodeURIComponent(segment)

                    return (
                      <Fragment key={href}>
                        {index > 0 && <BreadcrumbSeparator className="hidden sm:block" />}
                        <BreadcrumbItem className="min-w-0 truncate">
                          {isLast ? (
                            <BreadcrumbPage className="truncate">{label}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink asChild>
                              <Link href={href} className="truncate">
                                {label}
                              </Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </Fragment>
                    )
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          )}

          {mode === "header" && (
            <div className="ml-auto flex items-center gap-1 md:ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:inline-flex"
                aria-label="搜索文章"
                onClick={() => setSearchOpen(true)}
              >
                <SearchIcon className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => onModeChange("dock")}
              >
                <PanelBottomOpenIcon className="size-3.5" />
                Dock
              </Button>
            </div>
          )}

          {mode === "dock" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onModeChange("header")}
            >
              <PanelBottomOpenIcon className="size-3.5 rotate-180" />
              <span className="hidden sm:inline">顶部菜单</span>
            </Button>
          )}
        </div>
      </header>

      <PostSearch posts={posts} open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
