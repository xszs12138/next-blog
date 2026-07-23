import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { cookies } from "next/headers"

import "@workspace/ui/globals.css"
import "highlight.js/styles/github.css"
import { cn } from "@workspace/ui/lib/utils"
import { ThemeStorageSync } from "@/components/ThemeStorageSync"
import { SiteHeader } from "@/components/SiteHeader"
import { DockMenu } from "@/components/DockMenu"
import { MobileNav } from "@/components/MobileNav"
import { getAllPosts } from "@/lib/blog"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "Home",
    template: "%s | Home",
  },
  description: "Personal blog about tech, coding and more.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const storedTheme = (await cookies()).get("theme")?.value
  const isDark = storedTheme === "dark"
  const posts = await getAllPosts()

  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable,
        isDark && "dark"
      )}
    >
      <body className="min-h-svh bg-background text-foreground pt-12">
        <ThemeStorageSync />
        <SiteHeader />
        {children}
        <DockMenu posts={posts} />
        <MobileNav posts={posts} />
      </body>
    </html>
  )
}
