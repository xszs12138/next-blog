import type { Metadata } from "next"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Code2Icon, MonitorCogIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "常用工具网站链接",
  description: "日常开发与使用中常用的软件、服务和组件库",
}

type Resource = {
  name: string
  description: string
  href: string
}

type Category = {
  name: string
  index: string
  icon: LucideIcon
  resources: Resource[]
}

const categories: Category[] = [
  {
    name: "系统与效率",
    index: "01",
    icon: MonitorCogIcon,
    resources: [
      {
        name: "图吧工具箱",
        description: "硬件检测、跑分、烤机的一站式工具合集",
        href: "https://www.tbtool.cn/",
      },
      {
        name: "Dism++",
        description: "Windows 系统精简与优化工具",
        href: "https://github.com/Chuyu-Team/Dism-Multi-language",
      },
      {
        name: "Everything",
        description: "秒级检索全盘文件的桌面搜索工具",
        href: "https://www.voidtools.com/",
      },
      {
        name: "Snipaste",
        description: "截图、取色、标注与贴图工具",
        href: "https://www.snipaste.com/",
      },
      {
        name: "7-Zip",
        description: "开源、轻量的压缩与解压工具",
        href: "https://www.7-zip.org/",
      },
      {
        name: "Rufus",
        description: "制作 U 盘启动盘的轻量工具",
        href: "https://rufus.ie/",
      },
    ],
  },
  {
    name: "开发与创作",
    index: "02",
    icon: Code2Icon,
    resources: [
      {
        name: "Ant Design Vue Next",
        description: "面向 Vue 3 的企业级 UI 组件库",
        href: "https://next.antdv.com/",
      },
      {
        name: "shadcn/ui",
        description: "可直接拥有源码的 React 组件集合",
        href: "https://ui.shadcn.com/",
      },
      {
        name: "Lucide",
        description: "简洁、开源的一套 SVG 图标库",
        href: "https://lucide.dev/",
      },
      {
        name: "Magic UI",
        description: "适配 shadcn/ui 的动效组件与页面元素",
        href: "https://magicui.design/",
      },
      {
        name: "Obsidian",
        description: "以本地 Markdown 为核心的笔记工具",
        href: "https://obsidian.md/",
      },
      {
        name: "Vercel",
        description: "适合前端项目的持续部署与托管平台",
        href: "https://vercel.com/",
      },
    ],
  },
]

export default function WebsitesPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 pt-8 pb-24 sm:px-6 sm:pt-16">
      <header className="mb-10 border-b border-border pb-7 sm:mb-12">
        <Link
          href="/tools"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← 返回在线功能
        </Link>
        <div className="mt-6">
          <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Resources
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            常用工具网站链接
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            日常开发、系统维护与创作时常用的软件和服务。
          </p>
        </div>
      </header>

      <div className="space-y-10 sm:space-y-12">
        {categories.map((category) => (
          <section
            key={category.name}
            aria-labelledby={`category-${category.index}`}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="text-xs font-medium tracking-[0.14em] text-muted-foreground">
                {category.index}
              </span>
              <category.icon className="size-4 text-muted-foreground" />
              <h2 id={`category-${category.index}`} className="font-medium">
                {category.name}
              </h2>
            </div>
            <div className="grid overflow-hidden rounded-xl border border-border sm:grid-cols-2">
              {category.resources.map((resource) => (
                <a
                  key={resource.name}
                  href={resource.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-h-28 flex-col justify-between border-b border-border p-5 transition-colors last:border-b-0 hover:bg-muted/45 sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-child(odd)]:border-r"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-medium group-hover:text-foreground">
                      {resource.name}
                    </h3>
                    <span className="text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {resource.description}
                  </p>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
