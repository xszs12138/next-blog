"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { HomeIcon, PencilIcon, SearchIcon, WrenchIcon, ClapperboardIcon, ImageIcon, PanelTopOpenIcon } from "lucide-react"

import type { PostMeta } from "@/lib/blog"
import { cn } from "@workspace/ui/lib/utils"
import { buttonVariants } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { Dock, DockIcon } from "@workspace/ui/components/dock"
import { PostSearch } from "@/components/PostSearch"

export type IconProps = React.HTMLAttributes<SVGElement>

const DATA = {
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: PencilIcon, label: "Blog" },
    { href: "/tools", icon: WrenchIcon, label: "在线功能" },
    { href: "/gallery", icon: ImageIcon, label: "图库" },
    { href: "/bangumi", icon: ClapperboardIcon, label: "番组" },
  ],
}

type DockMenuProps = {
  posts: PostMeta[]
  active: boolean
  onShowHeader: () => void
}

export function DockMenu({ posts, active, onShowHeader }: DockMenuProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!active) return
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [active])

  return (
    <>
      <TooltipProvider>
        <Dock
          direction="middle"
          className={cn(
            "fixed right-0 bottom-4 left-0 z-50 hidden sm:flex",
            !active && "!hidden"
          )}
        >
          {DATA.navbar.map((item) => (
            <DockIcon key={item.label}>
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-10 rounded-full sm:size-12"
                    )}
                  >
                    <item.icon className="size-3.5 sm:size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
          <Separator orientation="vertical" className="h-full" />
          <DockIcon>
            <Tooltip>
              <TooltipTrigger>
                <span
                  aria-label="切换到顶部菜单"
                  onClick={onShowHeader}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-10 cursor-pointer rounded-full sm:size-12"
                  )}
                >
                  <PanelTopOpenIcon className="size-3.5 sm:size-4" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>顶部菜单</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
          {/* Search */}
          <DockIcon>
            <Tooltip>
              <TooltipTrigger>
                <span
                  aria-label="搜索文章"
                  onClick={() => setSearchOpen(true)}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-10 cursor-pointer rounded-full sm:size-12"
                  )}
                >
                  <SearchIcon className="size-3.5 sm:size-4" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>搜索文章</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        </Dock>
      </TooltipProvider>

      <PostSearch
        posts={posts}
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />
    </>
  )
}
