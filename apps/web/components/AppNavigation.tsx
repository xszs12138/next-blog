"use client"

import { useEffect, useState } from "react"

import type { PostMeta } from "@/lib/blog"
import { DockMenu } from "@/components/DockMenu"
import { SiteHeader } from "@/components/SiteHeader"

type NavigationMode = "header" | "dock"

type AppNavigationProps = {
  posts: PostMeta[]
}

export function AppNavigation({ posts }: AppNavigationProps) {
  const [mode, setMode] = useState<NavigationMode>("header")
  const [preferencesLoaded, setPreferencesLoaded] = useState(false)

  useEffect(() => {
    if (window.localStorage.getItem("navigation-mode") === "dock") {
      setMode("dock")
    }
    setPreferencesLoaded(true)
  }, [])

  useEffect(() => {
    if (preferencesLoaded) {
      window.localStorage.setItem("navigation-mode", mode)
    }
  }, [mode, preferencesLoaded])

  return (
    <>
      <SiteHeader
        posts={posts}
        mode={mode}
        onModeChange={setMode}
      />
      <DockMenu
        posts={posts}
        active={mode === "dock"}
        onShowHeader={() => setMode("header")}
      />
    </>
  )
}
