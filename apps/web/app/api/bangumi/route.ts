// Proxy Bangumi v0 API to avoid CORS + set User-Agent
export async function GET(request: Request) {
  const uid = process.env.BANGUMI_UID
  if (!uid) {
    return Response.json({ error: "未配置 UID" }, { status: 400 })
  }

  const { searchParams } = new URL(request.url)
  const cat = searchParams.get("cat") || ""

  try {
    const url = `https://api.bgm.tv/v0/users/${uid}/collections?${cat ? `subject_type=${encodeURIComponent(cat)}` : ""}&limit=8`
    const res = await fetch(url, {
      headers: {
        "User-Agent": "next-blog/1.0 (personal blog; contact@example.com)",
        "Accept": "application/json",
      },
    })

    if (!res.ok) {
      return Response.json({ error: `API 返回 ${res.status}` }, { status: res.status })
    }

    const json = await res.json()
    return Response.json(json)
  } catch {
    return Response.json({ error: "请求失败" }, { status: 500 })
  }
}
