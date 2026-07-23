import { LoginForm } from "@/components/LoginForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "注册",
}

export default function SignupPage() {
  return <LoginForm mode="signup" />
}
