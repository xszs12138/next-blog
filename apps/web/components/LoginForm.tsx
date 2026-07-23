"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, signUp } from "@/lib/auth-client"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

export function LoginForm({ mode = "signin" }: { mode?: "signin" | "signup" }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (mode === "signup") {
        await signUp.email({
          name,
          email,
          password,
        })
      } else {
        await signIn.email({
          email,
          password,
        })
      }
      router.push("/")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败，请重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {mode === "signin" ? "登录" : "注册"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin"
            ? "登录后即可发表评论"
            : "创建账号开始使用"}
        </p>
      </div>

      {mode === "signup" && (
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">昵称</label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="你的名字"
          />
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">邮箱</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">密码</label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading
          ? "请稍候..."
          : mode === "signin"
            ? "登录"
            : "注册"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {mode === "signin" ? (
          <>
            还没有账号？{" "}
            <a href="/signup" className="underline hover:text-foreground">
              立即注册
            </a>
          </>
        ) : (
          <>
            已有账号？{" "}
            <a href="/login" className="underline hover:text-foreground">
              立即登录
            </a>
          </>
        )}
      </p>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            其他登录方式
          </span>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={async () => {
          await signIn.social({ provider: "github" })
        }}
      >
        GitHub
      </Button>
    </form>
  )
}
