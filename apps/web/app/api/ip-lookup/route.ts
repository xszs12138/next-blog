const IP_API_URL = "http://ip-api.com/json"

export async function GET(request: Request) {
  const ip = new URL(request.url).searchParams.get("ip")?.trim()
  if (!ip) {
    return Response.json({ error: "缺少 IP 地址" }, { status: 400 })
  }

  if (ip.length > 253) {
    return Response.json({ error: "IP 地址无效" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `${IP_API_URL}/${encodeURIComponent(ip)}?lang=zh-CN`,
      { cache: "no-store" }
    )
    const data = await response.json()

    return Response.json(data, { status: response.status })
  } catch {
    return Response.json({ error: "IP 服务暂时不可用" }, { status: 502 })
  }
}
