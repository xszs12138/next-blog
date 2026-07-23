"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, authClient } from "@/lib/auth-client"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

export default function SettingsPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [name, setName] = useState("")
  const [image, setImage] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")
      setImage(session.user.image || "")
    }
  }, [session])

  if (isPending) {
    return (
      <div className="text-center text-muted-foreground">加载中...</div>
    )
  }

  if (!session) {
    router.push("/login")
    return null
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    try {
      await authClient.updateUser({
        name: name.trim() || undefined,
        image: image.trim() || undefined,
      })
      setMessage("保存成功")
    } catch {
      setMessage("保存失败")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="w-full space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">个人设置</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          修改昵称和头像
        </p>
      </div>

      {/* Avatar preview */}
      {image && (
        <div className="flex justify-center">
          <img
            src={image}
            alt="Preview"
            className="size-20 rounded-full object-cover ring-2 ring-border"
          />
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          昵称
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="你的名字"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="image" className="text-sm font-medium">
          头像链接
        </label>
        <Input
          id="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "保存中..." : "保存"}
        </Button>
        {message && (
          <span
            className={
              message === "保存成功"
                ? "text-sm text-green-600"
                : "text-sm text-red-500"
            }
          >
            {message}
          </span>
        )}
      </div>
    </form>
  )
}
