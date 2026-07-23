"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Card } from "@workspace/ui/components/card"
import { ArrowLeftIcon, SearchIcon, Loader2Icon } from "lucide-react"
import Link from "next/link"

interface IpInfo {
  ip: string
  country: string
  regionName: string
  city: string
  isp: string
  org: string
  lat: number
  lon: number
  timezone: string
}

const ERROR_MAP: Record<string, string> = {
  "reserved range": "保留地址（内网 IP），无法查询地理位置",
  "private range": "私有地址（内网 IP），无法查询地理位置",
  "invalid query": "无效的 IP 地址，请检查后重试",
  "query quota exceeded": "查询次数已用完，请稍后再试",
}

function translateError(msg: string): string {
  const lower = msg.toLowerCase()
  for (const [key, value] of Object.entries(ERROR_MAP)) {
    if (lower.includes(key)) return value
  }
  return `查询失败：${msg}`
}

function translateResult(json: IpInfo): IpInfo {
  return {
    ...json,
    country: json.country || "未知",
    regionName: json.regionName || "未知",
    city: json.city || "未知",
    isp: json.isp || "未知",
    org: json.org || "未知",
      timezone: json.timezone || "未知",
  }
}

export default function IpLookupPage() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [data, setData] = useState<IpInfo | null>(null)

  const lookup = async (ip: string) => {
    setLoading(true)
    setError("")
    setData(null)
    try {
      const res = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?lang=zh-CN`)
      const json = await res.json()
      if (json.status === "fail") {
        setError(translateError(json.message))
      } else {
        setData(translateResult(json))
      }
    } catch {
      setError("网络请求失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ip = query.trim()
    if (!ip) return
    lookup(ip)
  }

  const handleLookupMyIp = () => {
    setQuery("")
    lookup("")
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pt-8 pb-20 sm:px-6 sm:pt-16 sm:pb-24">
      <Link
        href="/tools"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3" /> 返回工具列表
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="text-xl font-semibold">IP 地址查询</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          输入 IP 地址查询地理位置、运营商等信息。结果仅供参考，可能不准确
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入 IP 地址，如 8.8.8.8"
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !query.trim()}>
          {loading ? (
            <Loader2Icon className="size-4 animate-spin mr-1" />
          ) : (
            <SearchIcon className="size-4 mr-1" />
          )}
          查询
        </Button>
      </form>

      <Button
        variant="outline"
        className="mt-2"
        onClick={handleLookupMyIp}
        disabled={loading}
      >
        查询我的 IP
      </Button>

      {loading && (
        <div className="mt-6 animate-pulse space-y-4">
          <div className="rounded-lg border p-4 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-16 rounded bg-muted" />
                <div className="h-4 w-48 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-500">{error}</p>
      )}

      {!loading && data && (
        <Card className="mt-6 p-4">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-border">
              {data.ip && <Row label="IP 地址" value={data.ip} />}
              {data.country && <Row label="国家" value={data.country} />}
              {data.regionName && <Row label="省份" value={data.regionName} />}
              {data.city && <Row label="城市" value={data.city} />}
              {data.isp && <Row label="运营商" value={data.isp} />}
              {data.org && <Row label="组织" value={data.org} />}
              {data.timezone && <Row label="时区" value={data.timezone} />}
              {data.lat !== 0 && (
                <Row
                  label="坐标"
                  value={`${data.lat.toFixed(4)}, ${data.lon.toFixed(4)}`}
                />
              )}
            </tbody>
          </table>
        </Card>
      )}
    </main>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td className="w-24 py-2 text-muted-foreground">{label}</td>
      <td className="py-2">{value}</td>
    </tr>
  )
}
