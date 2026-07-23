"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { ArrowLeftIcon, MapPinIcon } from "lucide-react"
import Link from "next/link"

export default function MapPage() {
  const [lat, setLat] = useState("")
  const [lon, setLon] = useState("")
  const [marker, setMarker] = useState<{ lat: number; lon: number } | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const la = parseFloat(lat)
    const lo = parseFloat(lon)
    if (isNaN(la) || isNaN(lo)) return
    if (la < -90 || la > 90 || lo < -180 || lo > 180) return
    setMarker({ lat: la, lon: lo })
  }

  const handleLocate = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6))
        setLon(pos.coords.longitude.toFixed(6))
        setMarker({ lat: pos.coords.latitude, lon: pos.coords.longitude })
      },
      () => {}
    )
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
        <h1 className="text-xl font-semibold">地图定位</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          输入经纬度坐标在地图上显示位置
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2 mb-6">
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">纬度 (Lat)</label>
          <Input
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="-90 ~ 90"
            className="w-36 font-mono"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">经度 (Lon)</label>
          <Input
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            placeholder="-180 ~ 180"
            className="w-36 font-mono"
          />
        </div>
        <Button type="submit" disabled={!lat.trim() || !lon.trim()}>
          <MapPinIcon className="size-4 mr-1" />
          定位
        </Button>
        <Button type="button" variant="outline" onClick={handleLocate}>
          使用我的位置
        </Button>
      </form>

      {marker && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            坐标：{marker.lat.toFixed(6)}, {marker.lon.toFixed(6)}
          </p>
          <iframe
            title="地图"
            width="100%"
            height="450"
            className="rounded-lg border"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${marker.lon - 0.05},${marker.lat - 0.05},${marker.lon + 0.05},${marker.lat + 0.05}&layer=mapnik&marker=${marker.lat},${marker.lon}`}
          />
          <p className="flex gap-2 text-xs text-muted-foreground">
            <a
              href={`https://www.google.com/maps?q=${marker.lat},${marker.lon}`}
              target="_blank"
              className="underline hover:text-foreground"
            >
              在 Google Maps 中查看
            </a>
          </p>
        </div>
      )}
    </main>
  )
}
