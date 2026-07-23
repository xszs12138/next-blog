import { LoginForm } from "@/components/LoginForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "登录",
}

export default function LoginPage() {
  return <LoginForm mode="signin" />
}
