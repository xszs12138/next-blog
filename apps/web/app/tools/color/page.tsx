"use client"

import { useState, useMemo, useCallback } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { ArrowLeftIcon, CopyIcon, CheckIcon } from "lucide-react"
import Link from "next/link"

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace("#", "")
  if (h.length === 3) {
    const [r, g, b] = h.split("").map((c) => parseInt(c + c, 16))
    return { r: r!, g: g!, b: b! }
  }
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null
    return { r, g, b }
  }
  return null
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const nr = r / 255, ng = g / 255, nb = b / 255
  const max = Math.max(nr, ng, nb), min = Math.min(nr, ng, nb)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  switch (max) {
    case nr: h = ((ng - nb) / d + (ng < nb ? 6 : 0)) / 6; break
    case ng: h = ((nb - nr) / d + 2) / 6; break
    case nb: h = ((nr - ng) / d + 4) / 6; break
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

const PRESETS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280", "#1e293b",
  "#ffffff", "#000000",
]

const FORMATS = [
  {
    label: "HEX",
    get: (hex: string) => hex,
    set: (v: string) => v.startsWith("#") ? v : "#" + v,
  },
  {
    label: "RGB",
    get: (hex: string) => {
      const rgb = hexToRgb(hex)
      return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : ""
    },
    set: (_v: string) => "",
  },
  {
    label: "HSL",
    get: (hex: string) => {
      const rgb = hexToRgb(hex)
      if (!rgb) return ""
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
    },
    set: (_v: string) => "",
  },
]

export default function ColorPage() {
  const [hex, setHex] = useState("#3b82f6")
  const [copied, setCopied] = useState<string | null>(null)

  const rgb = useMemo(() => hexToRgb(hex), [hex])
  const hsl = useMemo(() => (rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null), [rgb])

  const handleHexInput = useCallback((value: string) => {
    let v = value.trim()
    if (!v.startsWith("#")) v = "#" + v
    if (hexToRgb(v)) setHex(v)
  }, [])

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const rgbStr = rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : ""
  const hslStr = hsl ? `${hsl.h}°, ${hsl.s}%, ${hsl.l}%` : ""

  return (
    <main className="mx-auto max-w-2xl px-4 pt-8 pb-20 sm:px-6 sm:pt-16 sm:pb-24">
      <Link
        href="/tools"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3" /> 返回工具列表
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="text-xl font-semibold">颜色转换</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          颜色选择器，HEX / RGB / HSL 互转
        </p>
      </header>

      <div className="space-y-6">
        {/* Color preview + picker */}
        <div className="flex items-center gap-4">
          <label className="relative cursor-pointer">
            <div
              className="size-16 rounded-lg border shadow-sm ring-1 ring-border/50"
              style={{ backgroundColor: hex }}
            />
            <input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="sr-only"
            />
          </label>
          <div>
            <p className="text-xs text-muted-foreground mb-1">点击色块选取颜色</p>
            <div className="flex items-center gap-2">
              <Input
                value={hex}
                onChange={(e) => handleHexInput(e.target.value)}
                className="w-28 font-mono text-sm"
                placeholder="#000000"
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => handleCopy(hex, "hex")}
              >
                {copied === "hex" ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
              </Button>
            </div>
          </div>
        </div>

        {/* RGB / HSL values */}
        {rgb && (
          <div className="grid gap-3 sm:grid-cols-2">
            {/* RGB */}
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">RGB</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => handleCopy(`rgb(${rgbStr})`, "rgb")}
                >
                  {copied === "rgb" ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
                </Button>
              </div>
              <p className="font-mono text-lg">{rgbStr}</p>
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="h-2 rounded" style={{ backgroundColor: `rgb(${rgb.r}, 0, 0)` }} />
                  <p className="mt-0.5 text-xs text-muted-foreground">R: {rgb.r}</p>
                </div>
                <div className="flex-1">
                  <div className="h-2 rounded" style={{ backgroundColor: `rgb(0, ${rgb.g}, 0)` }} />
                  <p className="mt-0.5 text-xs text-muted-foreground">G: {rgb.g}</p>
                </div>
                <div className="flex-1">
                  <div className="h-2 rounded" style={{ backgroundColor: `rgb(0, 0, ${rgb.b})` }} />
                  <p className="mt-0.5 text-xs text-muted-foreground">B: {rgb.b}</p>
                </div>
              </div>
            </div>

            {/* HSL */}
            {hsl && (
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">HSL</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => handleCopy(`hsl(${hslStr})`, "hsl")}
                  >
                    {copied === "hsl" ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
                  </Button>
                </div>
                <p className="font-mono text-lg">{hslStr}</p>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span>H: {hsl.h}°</span>
                  <span>S: {hsl.s}%</span>
                  <span>L: {hsl.l}%</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Presets */}
        <div>
          <p className="mb-2 text-xs text-muted-foreground">预设颜色</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((c) => (
              <button
                key={c}
                onClick={() => setHex(c)}
                className={[
                  "size-8 rounded-md border-2 transition-all hover:scale-110",
                  c === hex ? "border-foreground ring-2 ring-foreground/20" : "border-border/50",
                ].join(" ")}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
