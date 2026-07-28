"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  SearchIcon,
  Loader2Icon,
  MapPinIcon,
  ThermometerIcon,
  WindIcon,
  DropletsIcon,
  EyeIcon,
  SunIcon,
  CloudSunIcon,
  CloudIcon,
  CloudRainIcon,
  CloudLightningIcon,
  CloudSnowIcon,
  CloudFogIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { ToolPageHeader } from "@/components/ToolPageHeader"

const WeatherChart = dynamic(() => import("@/components/WeatherChart"), {
  ssr: false,
})

interface GeoResult {
  lat: string
  lon: string
  display_name: string
}

interface WeatherDay {
  date: string
  avgtempC: string
  maxtempC: string
  mintempC: string
  hourly: Array<{
    weatherDesc: Array<{ value: string }>
    windspeedKmph: string
    humidity: string
    visibility: string
    tempC: string
  }>
}

interface WeatherData {
  current_condition: Array<{
    temp_C: string
    FeelsLikeC: string
    weatherDesc: Array<{ value: string }>
    windspeedKmph: string
    humidity: string
    visibility: string
    cloudcover: string
  }>
  weather: WeatherDay[]
}

export default function WeatherPage() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [location, setLocation] = useState<{ lat: number; lon: number; name: string } | null>(null)

  const search = async (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return

    setLoading(true)
    setError("")
    setWeather(null)
    setLocation(null)

    try {
      // Geocode
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`
      )
      const geoData: GeoResult[] = await geoRes.json()
      if (!geoData.length) {
        setError("未找到该地点")
        setLoading(false)
        return
      }

      const { lat, lon, display_name } = geoData[0]!
      setLocation({ lat: parseFloat(lat), lon: parseFloat(lon), name: display_name })

      // Weather via wttr.in
      const weatherRes = await fetch(
        `https://wttr.in/${lat},${lon}?format=j1&lang=zh`
      )
      const weatherData: WeatherData = await weatherRes.json()
      setWeather(weatherData)
    } catch {
      setError("请求失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  const current = weather?.current_condition[0]
  const hourlyTemperatures = weather?.weather[0]?.hourly.map((hour, index) => ({
    time: `${index}:00`,
    temp: Number.parseFloat(hour.tempC),
  }))

  const DAY_NAMES = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]

  function getWeatherIcon(desc: string): LucideIcon {
    const d = desc.toLowerCase()
    if (d.includes("晴") || d.includes("sun") || d.includes("clear")) return SunIcon
    if (d.includes("多云") || (d.includes("cloud") && d.includes("sun"))) return CloudSunIcon
    if (d.includes("阴") || d.includes("overcast")) return CloudIcon
    if (d.includes("雨") || d.includes("rain") || d.includes("drizzle")) return CloudRainIcon
    if (d.includes("雷") || d.includes("thunder")) return CloudLightningIcon
    if (d.includes("雪") || d.includes("snow")) return CloudSnowIcon
    if (d.includes("雾") || d.includes("fog") || d.includes("mist")) return CloudFogIcon
    return CloudSunIcon
  }

  function formatDate(dateStr: string) {
    const [year, month, day] = dateStr.split("-").map(Number)
    const d = new Date(year!, month! - 1, day!)
    return {
      day: DAY_NAMES[d.getDay()] ?? "",
      date: `${d.getMonth() + 1}/${d.getDate()}`,
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 pt-8 pb-20 sm:px-6 sm:pt-16 sm:pb-24">
      <ToolPageHeader
        title="天气查询"
        description="输入城市名称查询天气和位置，数据仅供参考"
      />

      <form onSubmit={search} className="flex gap-2 mb-6">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入城市名，如 北京、Tokyo、London"
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !query.trim()}>
          {loading ? <Loader2Icon className="size-4 animate-spin mr-1" /> : <SearchIcon className="size-4 mr-1" />}
          查询
        </Button>
      </form>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {loading && (
        <div className="space-y-6 animate-pulse">
          <div className="h-4 w-64 rounded bg-muted" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg border p-4 space-y-2">
                <div className="h-4 w-6 rounded bg-muted" />
                <div className="h-8 w-16 rounded bg-muted" />
                <div className="h-3 w-24 rounded bg-muted" />
              </div>
            ))}
          </div>
          <div className="rounded-lg border p-4 space-y-3">
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-[200px] rounded bg-muted" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-12 rounded bg-muted" />
                  <div className="h-8 w-8 rounded bg-muted" />
                </div>
                <div className="h-6 w-20 rounded bg-muted" />
                <div className="h-3 w-28 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && location && weather && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPinIcon className="size-4" />
            {location.name}
            <span className="text-xs">
              ({location.lat.toFixed(4)}, {location.lon.toFixed(4)})
            </span>
          </div>

          {current && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border p-4">
                <ThermometerIcon className="size-5 text-orange-500" />
                <p className="mt-2 text-3xl font-bold">{current.temp_C}°C</p>
                <p className="text-sm text-muted-foreground">
                  体感 {current.FeelsLikeC}°C · {current.weatherDesc[0]?.value}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <WindIcon className="size-5 text-blue-500" />
                <p className="mt-2 text-2xl font-bold">{current.windspeedKmph}</p>
                <p className="text-sm text-muted-foreground">km/h 风速</p>
              </div>
              <div className="rounded-lg border p-4">
                <DropletsIcon className="size-5 text-cyan-500" />
                <p className="mt-2 text-2xl font-bold">{current.humidity}%</p>
                <p className="text-sm text-muted-foreground">湿度</p>
              </div>
              <div className="rounded-lg border p-4">
                <EyeIcon className="size-5 text-gray-500" />
                <p className="mt-2 text-2xl font-bold">{current.visibility}</p>
                <p className="text-sm text-muted-foreground">km 能见度</p>
              </div>
            </div>
          )}

          {/* Temperature chart */}
          {hourlyTemperatures && (
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium mb-3">24 小时温度趋势</h3>
              <div className="h-[200px]">
                <WeatherChart data={hourlyTemperatures} />
              </div>
            </div>
          )}

          {/* Daily forecast */}
          {weather.weather.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">未来天气</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {weather.weather.map((day, i) => {
                  const Icon = getWeatherIcon(day.hourly[0]?.weatherDesc[0]?.value ?? "")
                  const { day: dayName, date } = formatDate(day.date)
                  return (
                    <div key={i} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            {i === 0 ? "今天" : dayName}
                          </p>
                          <p className="text-xs text-muted-foreground">{date}</p>
                        </div>
                        <Icon className="size-8 text-primary" />
                      </div>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-xl font-bold text-red-500">{day.maxtempC}°</span>
                        <span className="text-sm text-muted-foreground">/</span>
                        <span className="text-lg text-blue-500">{day.mintempC}°</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        均温 {day.avgtempC}°C · {day.hourly[0]?.weatherDesc[0]?.value}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
