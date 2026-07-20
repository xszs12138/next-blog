"use client"

import { useEffect } from "react"

const themeCookie = "theme"
const oneYearInSeconds = 60 * 60 * 24 * 365

export function ThemeStorageSync() {
  useEffect(() => {
    const hasThemeCookie = document.cookie
      .split("; ")
      .some((cookie) => cookie.startsWith(`${themeCookie}=`))

    if (hasThemeCookie) return

    const savedTheme = localStorage.getItem(themeCookie)
    const theme =
      savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"

    document.documentElement.classList.toggle("dark", theme === "dark")
    document.cookie = `${themeCookie}=${theme}; path=/; max-age=${oneYearInSeconds}; samesite=lax`
  }, [])

  return null
}
