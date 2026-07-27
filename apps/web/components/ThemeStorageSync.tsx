"use client"

import { useEffect } from "react"

const themeCookie = "theme"

function getSavedTheme() {
  const theme = localStorage.getItem(themeCookie)
  return theme === "dark" || theme === "light" ? theme : null
}

export function ThemeStorageSync() {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const applyTheme = () => {
      const savedTheme = getSavedTheme()
      const theme = savedTheme ?? (mediaQuery.matches ? "dark" : "light")
      document.documentElement.classList.toggle("dark", theme === "dark")
    }

    const onSystemThemeChange = () => {
      if (!getSavedTheme()) applyTheme()
    }

    applyTheme()
    mediaQuery.addEventListener("change", onSystemThemeChange)
    return () => mediaQuery.removeEventListener("change", onSystemThemeChange)
  }, [])

  return null
}
