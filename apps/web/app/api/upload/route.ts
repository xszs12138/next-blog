import { NextResponse } from "next/server"
import { uploadImage, UploadError } from "@/lib/upload"

/**
 * POST /api/upload
 *
 * 上传图片到 7bu 图床。
 * Content-Type: multipart/form-data
 * 字段名: file（图片文件）
 * 可选字段: album_id（相册 ID）
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const albumId = formData.get("album_id") as string | null

    if (!file) {
      return NextResponse.json(
        { error: "缺少文件字段：请用 'file' 字段上传图片" },
        { status: 400 },
      )
    }

    const result = await uploadImage(
      file,
      file.name || undefined,
      albumId || undefined,
    )

    return NextResponse.json({ url: result.url })
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 },
      )
    }
    return NextResponse.json({ error: "上传失败" }, { status: 500 })
  }
}
