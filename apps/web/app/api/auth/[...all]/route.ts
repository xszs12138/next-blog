import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"
import { authErrorMessage } from "@/lib/error-codes"
import { NextRequest } from "next/server"

const { POST: _POST, GET: _GET } = toNextJsHandler(auth)

function wrapHandler(handler: (req: NextRequest) => Promise<Response>) {
  return async (req: NextRequest) => {
    const res = await handler(req)
    const body = await res.json().catch(() => null)

    // If the response is already in our format, pass through
    if (body && typeof body.code === "number") {
      return Response.json(body, { status: body.code === 0 ? 200 : 400 })
    }

    // Better Auth success response — return code: 0
    if (res.ok) {
      return Response.json({ code: 0, message: "ok", data: body }, { status: 200 })
    }

    // Better Auth error response — return code: 1 with Chinese message
    const message = authErrorMessage(
      body && typeof body === "object" && "code" in body
        ? new Error(body.message, { cause: body.code })
        : new Error(body?.message || "请求失败")
    )
    return Response.json({ code: 1, message }, { status: res.status })
  }
}

export const POST = wrapHandler(_POST as unknown as (req: NextRequest) => Promise<Response>)
export const GET = wrapHandler(_GET as unknown as (req: NextRequest) => Promise<Response>)
