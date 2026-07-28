"use client"

import { useSession, signOut } from "@/lib/auth-client"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"

import { NativeImageWithFallback } from "@/components/ImageWithFallback"

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
      {session.user?.image && (
        <NativeImageWithFallback
          src={session.user.image}
          alt=""
          containerClassName="size-6 rounded-full"
          className="size-6 rounded-full object-cover"
        />
      )}
      <span className="hidden text-sm sm:inline">{session.user?.name ?? "用户"}</span>
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
