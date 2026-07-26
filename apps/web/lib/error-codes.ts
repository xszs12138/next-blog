/** Maps Better Auth error codes to Chinese user-facing messages */
const AUTH_ERROR_MAP: Record<string, string> = {
  USER_ALREADY_EXISTS: "该邮箱已被注册，请使用其他邮箱",
  USER_NOT_FOUND: "用户不存在",
  INVALID_EMAIL_OR_PASSWORD: "邮箱或密码错误",
  INVALID_PASSWORD: "密码错误",
  EMAIL_NOT_VERIFIED: "邮箱尚未验证，请检查邮箱",
  ACCOUNT_NOT_FOUND: "账号不存在，请先注册",
  FAILED_TO_CREATE_USER: "注册失败，请稍后重试",
  FAILED_TO_CREATE_SESSION: "登录失败，请稍后重试",
  INVALID_TOKEN: "令牌无效，请重新登录",
  SESSION_EXPIRED: "登录已过期，请重新登录",
  TOO_MANY_REQUESTS: "请求过于频繁，请稍后再试",
  PROVIDER_NOT_FOUND: "不支持的登录方式",
  INVALID_CALLBACK: "回调地址无效",
  OAUTH_ACCOUNT_NOT_LINKED: "OAuth 账号未关联",
  SOCIAL_SIGNIN_FAILED: "第三方登录失败",
  PASSWORD_TOO_SHORT: "密码长度不足",
  PASSWORD_TOO_LONG: "密码过长",
  INVALID_EMAIL: "邮箱格式不正确",
  VALIDATION_ERROR: "输入数据有误，请检查后再试",
  UNPROCESSABLE_ENTITY: "输入数据有误，请检查后再试",
}

/** Get a Chinese error message for a Better Auth error code */
export function authErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Try to extract the code from Better Auth's error structure
    const err = error as Error & { code?: string; statusCode?: number }
    if (err.code) {
      const msg = AUTH_ERROR_MAP[err.code]
      if (msg) return msg
    }
    // If message contains a known code pattern
    for (const [code, msg] of Object.entries(AUTH_ERROR_MAP)) {
      if (err.message?.includes(code)) {
        return msg
      }
    }
    return err.message || "操作失败，请稍后重试"
  }
  return "操作失败，请稍后重试"
}
