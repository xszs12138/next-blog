import { BangumiRequestError, getBangumiCollections } from "@/lib/bangumi"

// Retained for callers outside the app; the page itself reads the shared server helper.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  try {
    return Response.json(await getBangumiCollections(searchParams.get("cat") ?? undefined))
  } catch (error) {
    const status = error instanceof BangumiRequestError ? error.status : 500
    const detail = error instanceof Error ? error.message : "请求失败"
    return Response.json({ error: "请求失败", detail }, { status })
  }
}
