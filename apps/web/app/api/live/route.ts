// Proxy Bilibili live status API to avoid CORS
export async function GET() {
  const roomId = process.env.BILIBILI_ROOM_ID
  if (!roomId) {
    return Response.json({ live: false, reason: "未配置房间号" })
  }

  try {
    const res = await fetch(
      `https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${roomId}`,
      { next: { revalidate: 30 } }
    )
    const json = await res.json()
    const liveStatus = json?.data?.live_status ?? 0

    return Response.json({
      live: liveStatus === 1,
      title: json?.data?.title ?? "",
      cover: json?.data?.cover ?? "",
      url: `https://live.bilibili.com/${roomId}`,
    })
  } catch {
    return Response.json({ live: false })
  }
}
