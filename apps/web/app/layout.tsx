import type { Metadata } from "next"
import Script from "next/script"
import NextTopLoader from "nextjs-toploader"

import "@workspace/ui/globals.css"
import "highlight.js/styles/github.css"
import { cn } from "@workspace/ui/lib/utils"
import { ThemeStorageSync } from "@/components/ThemeStorageSync"
import { AppNavigation } from "@/components/AppNavigation"
import { MobileNav } from "@/components/MobileNav"
import { FloatingToolbar } from "@/components/FloatingToolbar"
import { getAllPosts } from "@/lib/blog"
import { FlickeringGrid } from "@workspace/ui/components/flickering-grid"

export const metadata: Metadata = {
  title: {
    default: "Home",
    template: "%s | Home",
  },
  description: "Personal blog about tech, coding and more.",
}

const themeInitializationScript = `
  (() => {
    try {
      const savedTheme = localStorage.getItem("theme")
      const theme =
        savedTheme === "dark" || savedTheme === "light"
          ? savedTheme
          : window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
      document.documentElement.classList.toggle("dark", theme === "dark")
    } catch {}
  })()
`

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const posts = await getAllPosts()

  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={cn("antialiased", "font-sans")}
    >
      <body className="min-h-svh bg-background pt-14 text-foreground">
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitializationScript }}
        />
        <NextTopLoader
          color="#22c55e"
          height={3}
          showSpinner={false}
          shadow="0 0 10px #22c55e,0 0 5px #22c55e"
        />
        <FlickeringGrid
          className="fixed inset-0 -z-10"
          color="rgb(156, 163, 175)"
          maxOpacity={0.15}
          flickerChance={0.1}
        />
        <ThemeStorageSync />
        <AppNavigation posts={posts} />
        {children}
        <FloatingToolbar />
        <MobileNav />
      </body>
    </html>
  )
}
