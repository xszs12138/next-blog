import type { Metadata } from "next"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRightLeftIcon,
  BracesIcon,
  CloudSunIcon,
  Code2Icon,
  GlobeIcon,
  ImageIcon,
  Link2Icon,
  MapIcon,
  MapPinIcon,
  PaletteIcon,
  PenToolIcon,
} from "lucide-react"

export const metadata: Metadata = {
  title: "在线功能",
  description: "无需登录、打开即可使用的在线功能集合",
}

type Feature = {
  name: string
  description: string
  href: string
  icon: LucideIcon
}

type Category = {
  name: string
  index: string
  icon: LucideIcon
  features: Feature[]
}

const categories: Category[] = [
  {
    name: "开发",
    index: "01",
    icon: Code2Icon,
    features: [
      {
        name: "JSON 对比",
        description: "两个 JSON 逐行对比差异，新增与删除高亮标注",
        href: "/tools/json-diff",
        icon: ArrowRightLeftIcon,
      },
      {
        name: "JSON 转 TS 类型",
        description: "将 JSON 数据自动转换为 TypeScript interface",
        href: "/tools/json-to-ts",
        icon: BracesIcon,
      },
    ],
  },
  {
    name: "设计与图片",
    index: "02",
    icon: PenToolIcon,
    features: [
      {
        name: "颜色转换",
        description: "HEX、RGB 与 HSL 的即时转换和复制",
        href: "/tools/color",
        icon: PaletteIcon,
      },
      {
        name: "图片水印",
        description: "给图片添加可调位置、颜色与透明度的文字水印",
        href: "/tools/watermark",
        icon: ImageIcon,
      },
    ],
  },
  {
    name: "网络与生活",
    index: "03",
    icon: GlobeIcon,
    features: [
      {
        name: "IP 地址查询",
        description: "查询 IP 的地理位置和运营商等信息",
        href: "/tools/ip-lookup",
        icon: MapPinIcon,
      },
      {
        name: "地图定位",
        description: "输入经纬度坐标，在地图中显示位置",
        href: "/tools/map",
        icon: MapIcon,
      },
      {
        name: "天气查询",
        description: "查询城市天气、温度、风速与湿度",
        href: "/tools/weather",
        icon: CloudSunIcon,
      },
    ],
  },
  {
    name: "网站链接",
    index: "04",
    icon: Link2Icon,
    features: [
      {
        name: "常用工具网站链接",
        description: "系统维护、开发与创作时常用的网站、软件与服务",
        href: "/tools/websites",
        icon: Link2Icon,
      },
    ],
  },
]

export default function ToolsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 pt-8 pb-24 sm:px-6 sm:pt-16">
      <header className="mb-10 border-b border-border pb-7 sm:mb-12">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Utilities
        </p>
        <div className="mt-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            在线功能
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            不依赖登录，打开即可使用的小功能集合。
          </p>
        </div>
      </header>

      <div className="space-y-10 sm:space-y-12">
        {categories.map((category) => (
          <section
            key={category.name}
            aria-labelledby={`feature-${category.index}`}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="text-xs font-medium tracking-[0.14em] text-muted-foreground">
                {category.index}
              </span>
              <category.icon className="size-4 text-muted-foreground" />
              <h2 id={`feature-${category.index}`} className="font-medium">
                {category.name}
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {category.features.map((feature) => (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="group rounded-xl border border-border bg-background/45 p-5 transition-colors duration-300 hover:bg-muted/45"
                >
                  <feature.icon className="size-5 text-muted-foreground" />
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <h3 className="font-medium">{feature.name}</h3>
                    <span className="text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5">
                      →
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
