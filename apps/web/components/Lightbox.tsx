"use client"

import { useState, useEffect, useCallback } from "react"
import { XIcon, RotateCwIcon, ZoomInIcon, ZoomOutIcon, RotateCcwIcon } from "lucide-react"

import { NativeImageWithFallback } from "@/components/ImageWithFallback"

type LightboxProps = {
  src: string | null
  onClose: () => void
}

export function Lightbox({ src, onClose }: LightboxProps) {
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(1)

  const reset = useCallback(() => {
    setRotation(0)
    setScale(1)
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "+":
        case "=":
          setScale((s) => Math.min(s + 0.25, 5))
          break
        case "-":
          setScale((s) => Math.max(s - 0.25, 0.25))
          break
        case "0":
          reset()
          break
        case "r":
          setRotation((r) => r + 90)
          break
      }
    },
    [onClose, reset]
  )

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    setScale((s) => Math.min(Math.max(s - e.deltaY * 0.001, 0.25), 5))
  }, [])

  useEffect(() => {
    if (!src) return
    reset()
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("wheel", handleWheel, { passive: false })
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("wheel", handleWheel)
      document.body.style.overflow = ""
    }
  }, [src, handleKeyDown, handleWheel, reset])

  if (!src) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* 顶部工具栏 */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); setRotation((r) => r - 90) }}
          className="rounded-full bg-foreground/10 p-2 text-foreground/70 backdrop-blur transition-colors hover:bg-foreground/20 hover:text-foreground"
          title="逆时针旋转"
        >
          <RotateCcwIcon className="size-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setRotation((r) => r + 90) }}
          className="rounded-full bg-foreground/10 p-2 text-foreground/70 backdrop-blur transition-colors hover:bg-foreground/20 hover:text-foreground"
          title="顺时针旋转"
        >
          <RotateCwIcon className="size-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setScale((s) => Math.max(s - 0.25, 0.25)) }}
          className="rounded-full bg-foreground/10 p-2 text-foreground/70 backdrop-blur transition-colors hover:bg-foreground/20 hover:text-foreground"
          title="缩小"
        >
          <ZoomOutIcon className="size-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setScale((s) => Math.min(s + 0.25, 5)) }}
          className="rounded-full bg-foreground/10 p-2 text-foreground/70 backdrop-blur transition-colors hover:bg-foreground/20 hover:text-foreground"
          title="放大"
        >
          <ZoomInIcon className="size-5" />
        </button>
        <button
          onClick={onClose}
          className="rounded-full bg-foreground/10 p-2 text-foreground/70 backdrop-blur transition-colors hover:bg-foreground/20 hover:text-foreground"
          title="关闭"
        >
          <XIcon className="size-5" />
        </button>
      </div>

      {/* 图片 */}
      <NativeImageWithFallback
        src={src}
        alt="预览"
        containerClassName="max-h-[90vh] max-w-[90vw] rounded-lg"
        className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain transition-transform duration-300"
        style={{
          transform: `rotate(${rotation}deg) scale(${scale})`,
        }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* 底部提示 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-foreground/10 px-4 py-1.5 text-xs text-foreground/50 backdrop-blur">
        滚轮缩放 · R 旋转 · Esc 关闭 · 0 重置
      </div>
    </div>
  )
}
