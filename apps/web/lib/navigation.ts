import type { LucideIcon } from "lucide-react"
import {
  ClapperboardIcon,
  Grid2X2Icon,
  HomeIcon,
  ImageIcon,
  PencilIcon,
  WrenchIcon,
} from "lucide-react"
import { TOOL_ROUTE_LABELS } from "@/lib/tool-catalog"

export type NavigationItem = {
  href: string
  label: string
  shortLabel?: string
  description?: string
  icon: LucideIcon
}

export const ROUTE_LABELS: Record<string, string> = {
  "/blog": "Blog",
  "/features": "在线功能",
  "/tools": "在线功能",
  ...TOOL_ROUTE_LABELS,
  "/gallery": "图库",
  "/bangumi": "番组",
  "/login": "登录",
  "/signup": "注册",
  "/settings": "设置",
  "/test": "测试页面",
}

export const PRIMARY_NAVIGATION_ITEMS: NavigationItem[] = [
  { href: "/", label: "首页", shortLabel: "Home", icon: HomeIcon },
  { href: "/blog", label: "博客", shortLabel: "Blog", icon: PencilIcon },
]

export const TOOL_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    href: "/tools",
    label: "在线功能",
    description: "打开即用的小功能集合",
    icon: WrenchIcon,
  },
  {
    href: "/tools/websites",
    label: "常用工具网站链接",
    description: "开发、系统与创作资源",
    icon: Grid2X2Icon,
  },
]

export const MEDIA_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    href: "/gallery",
    label: "图库",
    description: "保存的图片与视觉记录",
    icon: ImageIcon,
  },
  {
    href: "/bangumi",
    label: "番组",
    description: "正在追看的动画记录",
    icon: ClapperboardIcon,
  },
]

export const COMPACT_NAVIGATION_ITEMS = [
  ...PRIMARY_NAVIGATION_ITEMS,
  TOOL_NAVIGATION_ITEMS[0]!,
  ...MEDIA_NAVIGATION_ITEMS,
]
