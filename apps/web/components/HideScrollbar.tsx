"use client"

import { useEffect } from "react"

export function HideScrollbar() {
  useEffect(() => {
    const style = document.createElement("style")
    style.id = "hide-scrollbar"
    style.textContent = `
      html {
        scrollbar-width: none;
      }
      html::-webkit-scrollbar {
        display: none;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.getElementById("hide-scrollbar")?.remove()
    }
  }, [])

  return null
}
