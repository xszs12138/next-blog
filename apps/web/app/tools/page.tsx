import type { Metadata } from "next"
import MagicBento from "@/components/MagicBento"

export const metadata: Metadata = {
  title: "常用工具",
  description: "常用工具软件链接合集",
}

const tools = [
  {
    label: "硬件检测",
    title: "图吧工具箱",
    description: "硬件检测、跑分、烤机一站式工具合集，装机必备",
    href: "https://www.tbtool.cn/",
    color: "#1a1a2e",
  },
  {
    label: "系统优化",
    title: "Dism++",
    description: "Windows 系统精简优化工具，C 盘清理利器",
    href: "https://github.com/Chuyu-Team/Dism-Multi-language",
    color: "#16213e",
  },
  {
    label: "组件库",
    title: "Ant Design Vue Next",
    description: "Vue 3 企业级 UI 组件库，Ant Design 官方 Vue 版",
    href: "https://next.antdv.com/",
    color: "#0f3460",
  },
  {
    label: "组件库",
    title: "shadcn/ui",
    description: "复制粘贴式组件库，支持 React / Vue，2025 最火 UI 方案",
    href: "https://ui.shadcn.com/",
    color: "#1a1a2e",
  },
  {
    label: "文件搜索",
    title: "Everything",
    description: "Windows 文件搜索神器，秒级全盘检索，远超系统自带",
    href: "https://www.voidtools.com/",
    color: "#16213e",
  },
  {
    label: "图标",
    title: "Lucide",
    description: "开源 SVG 图标库，轻量美观，shadcn/ui 默认图标集",
    href: "https://lucide.dev/",
    color: "#0f3460",
  },
  {
    label: "笔记",
    title: "Obsidian",
    description: "本地 Markdown 笔记软件，双链 + 图谱，知识管理利器",
    href: "https://obsidian.md/",
    color: "#1a1a2e",
  },
  {
    label: "动画库",
    title: "Magic UI",
    description: "动画组件库，与 shadcn/ui 完美搭配，开箱即用",
    href: "https://magicui.design/",
    color: "#16213e",
  },
  {
    label: "部署",
    title: "Vercel",
    description: "前端部署平台，Next.js 官方推荐，Git 推送自动部署",
    href: "https://vercel.com/",
    color: "#0f3460",
  },
  {
    label: "截图",
    title: "Snipaste",
    description: "截图 + 贴图工具，支持取色、标注、贴图置顶",
    href: "https://www.snipaste.com/",
    color: "#1a1a2e",
  },
  {
    label: "压缩",
    title: "7-Zip",
    description: "开源免费压缩解压工具，支持几乎所有压缩格式",
    href: "https://www.7-zip.org/",
    color: "#16213e",
  },
  {
    label: "U 盘",
    title: "Rufus",
    description: "U 盘启动盘制作工具，轻量免费，装机必备",
    href: "https://rufus.ie/",
    color: "#0f3460",
  },
]

export default function ToolsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-6 sm:pt-16 sm:pb-24">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          常用工具
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          收录日常开发和使用中常用的工具、软件、组件库链接，持续更新
        </p>
      </div>
      <MagicBento
        cards={tools}
        enableStars
        enableBorderGlow
        enableSpotlight
        clickEffect
        glowColor="0, 200, 120"
      />
    </main>
  )
}
