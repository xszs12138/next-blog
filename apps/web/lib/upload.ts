/**
 * 7bu 图床上传工具
 * 接口文档：https://7bu.top/page/api-docs.html
 */

const API_BASE = "https://7bu.top/api/v1"

export type UploadResult = {
  url: string
  width?: number
  height?: number
  size?: number
  filename?: string
}

type SevenBuResponse = {
  status: boolean
  message: string
  data: {
    links: {
      url: string
    }
    width?: number
    height?: number
    size?: number
    filename?: string
  }
}

export class UploadError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message)
    this.name = "UploadError"
  }
}

/**
 * 上传单张图片到 7bu 图床
 * @param file - 图片 File 对象或 Buffer
 * @param filename - 文件名
 * @param albumId - 可选，相册 ID
 */
export async function uploadImage(
  file: File | Blob,
  filename?: string,
  albumId?: string,
): Promise<UploadResult> {
  const token = process.env["7BU_TOKEN"]
  if (!token) {
    throw new UploadError("7BU_TOKEN 环境变量未设置")
  }

  const formData = new FormData()
  formData.append("file", file, filename ?? "image")

  if (albumId) {
    formData.append("album_id", albumId)
  }

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!res.ok) {
    throw new UploadError(
      `上传失败：HTTP ${res.status} ${res.statusText}`,
      res.status,
    )
  }

  const json = (await res.json()) as SevenBuResponse

  if (!json.status) {
    throw new UploadError(`上传失败：${json.message}`)
  }

  return {
    url: json.data.links.url,
    width: json.data.width,
    height: json.data.height,
    size: json.data.size,
    filename: json.data.filename,
  }
}

/**
 * 批量上传多张图片
 */
export async function uploadImages(
  files: (File | Blob)[],
  albumId?: string,
): Promise<UploadResult[]> {
  return Promise.all(files.map((file) => uploadImage(file, undefined, albumId)))
}
