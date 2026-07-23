"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  ArrowLeftIcon,
  UploadIcon,
  DownloadIcon,
  TrashIcon,
} from "lucide-react"
import Link from "next/link"

type Position = "center" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "tile"

const POSITIONS: { value: Position; label: string }[] = [
  { value: "center", label: "居中" },
  { value: "topLeft", label: "左上" },
  { value: "topRight", label: "右上" },
  { value: "bottomLeft", label: "左下" },
  { value: "bottomRight", label: "右下" },
  { value: "tile", label: "平铺" },
]

export default function WatermarkPage() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [imageName, setImageName] = useState("")
  const [text, setText] = useState("水印文字")
  const [position, setPosition] = useState<Position>("bottomRight")
  const [color, setColor] = useState("#ffffff")
  const [opacity, setOpacity] = useState(0.5)
  const [fontSize, setFontSize] = useState(24)
  const [previewUrl, setPreviewUrl] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return
    setImageName(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => setImage(img)
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const renderPreview = useCallback(() => {
    if (!image || !canvasRef.current) return
    const canvas = canvasRef.current
    const maxW = 600
    const scale = Math.min(1, maxW / image.width)
    canvas.width = image.width * scale
    canvas.height = image.height * scale

    const ctx = canvas.getContext("2d")!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    // Draw watermark
    ctx.globalAlpha = opacity
    ctx.fillStyle = color
    const fs = fontSize * scale
    ctx.font = `${fs}px sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    const pad = fs * 0.6

    if (position === "tile") {
      const metrics = ctx.measureText(text)
      const tw = metrics.width + pad * 2
      const th = fs + pad
      ctx.textAlign = "left"
      for (let y = 0; y < canvas.height; y += th) {
        const offset = Math.floor(y / th) % 2 === 0 ? 0 : tw / 2
        for (let x = -tw; x < canvas.width + tw; x += tw) {
          ctx.fillText(text, x + offset + pad, y + th / 2)
        }
      }
    } else {
      let x: number, y: number
      switch (position) {
        case "topLeft": x = pad; y = pad; ctx.textAlign = "left"; ctx.textBaseline = "top"; break
        case "topRight": x = canvas.width - pad; y = pad; ctx.textAlign = "right"; ctx.textBaseline = "top"; break
        case "bottomLeft": x = pad; y = canvas.height - pad; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; break
        case "bottomRight": x = canvas.width - pad; y = canvas.height - pad; ctx.textAlign = "right"; ctx.textBaseline = "bottom"; break
        default: x = canvas.width / 2; y = canvas.height / 2; ctx.textAlign = "center"; ctx.textBaseline = "middle"
      }
      ctx.fillText(text, x, y)
    }

    ctx.globalAlpha = 1
    setPreviewUrl(canvas.toDataURL("image/png"))
  }, [image, text, position, color, opacity, fontSize])

  useEffect(() => {
    renderPreview()
  }, [renderPreview])

  const handleDownload = () => {
    if (!image || !canvasRef.current) return

    // Generate full-resolution version
    const fullCanvas = document.createElement("canvas")
    fullCanvas.width = image.width
    fullCanvas.height = image.height
    const ctx = fullCanvas.getContext("2d")!
    ctx.drawImage(image, 0, 0)

    ctx.globalAlpha = opacity
    ctx.fillStyle = color
    ctx.font = `${fontSize}px sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    const pad = fontSize * 0.6

    if (position === "tile") {
      const metrics = ctx.measureText(text)
      const tw = metrics.width + pad * 2
      const th = fontSize + pad
      ctx.textAlign = "left"
      for (let y = 0; y < fullCanvas.height; y += th) {
        const offset = Math.floor(y / th) % 2 === 0 ? 0 : tw / 2
        for (let x = -tw; x < fullCanvas.width + tw; x += tw) {
          ctx.fillText(text, x + offset + pad, y + th / 2)
        }
      }
    } else {
      let x: number, y: number
      switch (position) {
        case "topLeft": x = pad; y = pad; ctx.textAlign = "left"; ctx.textBaseline = "top"; break
        case "topRight": x = fullCanvas.width - pad; y = pad; ctx.textAlign = "right"; ctx.textBaseline = "top"; break
        case "bottomLeft": x = pad; y = fullCanvas.height - pad; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; break
        case "bottomRight": x = fullCanvas.width - pad; y = fullCanvas.height - pad; ctx.textAlign = "right"; ctx.textBaseline = "bottom"; break
        default: x = fullCanvas.width / 2; y = fullCanvas.height / 2; ctx.textAlign = "center"; ctx.textBaseline = "middle"
      }
      ctx.fillText(text, x, y)
    }

    const link = document.createElement("a")
    link.download = `watermarked-${imageName || "image"}.png`
    link.href = fullCanvas.toDataURL("image/png")
    link.click()
  }

  const reset = () => {
    setImage(null)
    setImageName("")
    setPreviewUrl("")
  }

  return (
    <main className="mx-auto max-w-4xl px-4 pt-8 pb-20 sm:px-6 sm:pt-16 sm:pb-24">
      <Link
        href="/tools"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3" /> 返回工具列表
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="text-xl font-semibold">图片水印</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          给图片添加文字水印，所有处理均在本地完成，不会上传到服务器
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Preview */}
        <div className="order-1 lg:order-1">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex min-h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30"
          >
            {image ? (
              <div className="w-full p-2">
                <canvas ref={canvasRef} className="mx-auto max-w-full rounded" />
              </div>
            ) : (
              <div className="text-center space-y-3 p-8">
                <UploadIcon className="mx-auto size-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  拖拽图片到这里，或点击下方按钮选择
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFile(file)
                  }}
                  className="hidden"
                />
                <Button variant="outline" onClick={() => fileRef.current?.click()}>
                  选择图片
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="order-2 space-y-4 lg:order-2">
          {image && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">水印文字</label>
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="输入水印文字"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">位置</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {POSITIONS.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPosition(p.value)}
                      className={[
                        "rounded-md border px-2 py-1.5 text-xs transition-colors",
                        position === p.value
                          ? "border-primary/50 bg-primary/10 text-primary"
                          : "border-border hover:bg-muted/50",
                      ].join(" ")}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">颜色</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-9 w-full cursor-pointer rounded-md border bg-background p-1"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  透明度：{Math.round(opacity * 100)}%
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={Math.round(opacity * 100)}
                  onChange={(e) => setOpacity(Number(e.target.value) / 100)}
                  className="w-full"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  字号：{fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="120"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleDownload} className="flex-1" disabled={!previewUrl}>
                  <DownloadIcon className="mr-1 size-4" />
                  下载
                </Button>
                <Button variant="outline" onClick={reset}>
                  <TrashIcon className="mr-1 size-4" />
                  重置
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
