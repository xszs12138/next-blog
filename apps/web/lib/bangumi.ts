export type BangumiSubject = {
  subject_id: number
  type: number
  rate: number
  subject: {
    name: string
    name_cn: string
    images: { medium: string; large: string }
    score: number
    date: string
  }
}

export type BangumiCollections = {
  data: BangumiSubject[]
  total: number
}

export class BangumiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = "BangumiRequestError"
  }
}

export async function getBangumiCollections(category?: string): Promise<BangumiCollections> {
  const uid = process.env.BANGUMI_UID
  if (!uid) {
    throw new BangumiRequestError("未配置 BANGUMI_UID", 500)
  }

  const searchParams = new URLSearchParams({ limit: "8" })
  if (category) searchParams.set("subject_type", category)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)

  try {
    const response = await fetch(
      `https://api.bgm.tv/v0/users/${uid}/collections?${searchParams}`,
      {
        headers: {
          "User-Agent": "next-blog/1.0 (personal blog; contact@example.com)",
          Accept: "application/json",
        },
        next: { revalidate: 300 },
        signal: controller.signal,
      }
    )
    console.log(`Bangumi API 返回 ${response.status} ${response.statusText}`)
    if (!response.ok) {
      throw new BangumiRequestError(
        `Bangumi API 返回 ${response.status}`,
        response.status
      )
    }

    return (await response.json()) as BangumiCollections
  } catch (error) {
    if (error instanceof BangumiRequestError) throw error
    console.log("error",error);
    
    const message = error instanceof Error ? error.message : "请求失败"
    throw new BangumiRequestError(message, 502)
  } finally {
    clearTimeout(timeout)
  }
}
