"use client"

import { useSession, signOut } from "@/lib/auth-client"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"

export function AuthButton() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <Button variant="ghost" size="sm" disabled>
        ...
      </Button>
    )
  }

  if (!session) {
    return (
      <Link href="/login">
        <Button variant="ghost" size="sm">登录</Button>
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {session.user.image && (
        <img
          src={session.user.image}
          alt=""
          className="size-6 rounded-full"
        />
      )}
      <span className="hidden text-sm sm:inline">{session.user.name}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut()}
      >
        退出
      </Button>
    </div>
  )
}
