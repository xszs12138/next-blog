"use client"

import { useState } from "react"
import Link from "next/link"
import { ClapperboardIcon, HomeIcon, ImageIcon, MenuIcon, PencilIcon, WrenchIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { AnimatedThemeToggler } from "@workspace/ui/components/animated-theme-toggler"

const NAV_ITEMS = [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/blog", icon: PencilIcon, label: "Blog" },
  { href: "/tools", icon: WrenchIcon, label: "在线功能" },
  { href: "/gallery", icon: ImageIcon, label: "图库" },
  { href: "/bangumi", icon: ClapperboardIcon, label: "番组" },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="fixed top-1.5 right-4 z-50 sm:hidden">
        <Button
          variant="outline"
          size="icon"
          className="size-11 rounded-full shadow-md"
          onClick={() => setOpen(true)}
          aria-label="打开导航菜单"
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

            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm text-muted-foreground">切换主题</span>
              <AnimatedThemeToggler />
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
