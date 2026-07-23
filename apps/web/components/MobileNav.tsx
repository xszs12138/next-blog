"use client"

import { useState } from "react"
import Link from "next/link"
import { HomeIcon, MenuIcon, PencilIcon, SearchIcon } from "lucide-react"

import type { PostMeta } from "@/lib/blog"
import { cn } from "@workspace/ui/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { AnimatedThemeToggler } from "@workspace/ui/components/animated-theme-toggler"
import { PostSearch } from "@/components/PostSearch"

type MobileNavProps = {
  posts: PostMeta[]
}

const NAV_ITEMS = [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/blog", icon: PencilIcon, label: "Blog" },
]

export function MobileNav({ posts }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      {/* Floating trigger */}
      <div className="fixed right-4 bottom-4 z-50 sm:hidden">
        <Button
          variant="outline"
          size="icon"
          className="size-11 rounded-full shadow-lg"
          onClick={() => setOpen(true)}
          aria-label="打开菜单"
        >
          <MenuIcon className="size-5" />
        </Button>
      </div>

      {/* Bottom sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl px-4 pb-8 pt-4">
          <SheetHeader>
            <SheetTitle>菜单</SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "justify-start gap-3"
                )}
              >
                <item.icon className="size-5" />
                {item.label}
              </Link>
            ))}

            <Separator className="my-2" />

            <button
              type="button"
              onClick={() => {
                setSearchOpen(true)
                setOpen(false)
              }}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "justify-start gap-3"
              )}
            >
              <SearchIcon className="size-5" />
              搜索文章
            </button>

            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm text-muted-foreground">切换主题</span>
              <AnimatedThemeToggler />
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      <PostSearch posts={posts} open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
