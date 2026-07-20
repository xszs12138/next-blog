import { Geist, Geist_Mono } from "next/font/google"
import { cookies } from "next/headers"

import "@workspace/ui/globals.css"
import { cn } from "@workspace/ui/lib/utils"
import { ThemeStorageSync } from "@/components/theme-storage-sync"
import { DockMenu } from "@/lib/ui/DockMenu"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const storedTheme = (await cookies()).get("theme")?.value
  const isDark = storedTheme === "dark"

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable,
        isDark && "dark"
      )}
    >
      <body className="min-h-svh">
        <ThemeStorageSync />
        {children}
        <DockMenu />
      </body>
    </html>
  )
}
