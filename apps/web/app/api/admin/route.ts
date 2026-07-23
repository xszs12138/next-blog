import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { headers } from "next/headers"

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return Response.json({ isAdmin: false })
  }

  const firstUser = db
    .prepare("SELECT id FROM user ORDER BY rowid ASC LIMIT 1")
    .get() as { id: string } | undefined

  return Response.json({ isAdmin: firstUser?.id === session.user.id })
}
