import type { Metadata } from "next"
import Link from "next/link"
import {
  MapPinIcon,
  MapIcon,
  BracesIcon,
  ImageIcon,
  ArrowRightLeftIcon,
  PaletteIcon,
  CloudSunIcon,
  Code2Icon,
  GlobeIcon,
  PenToolIcon,
  CoffeeIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "工具",
  description: "实用在线工具集",
}

type Tool = {
  name: string
  description: string
  href: string
  icon: LucideIcon
}

type Category = {
  name: string
  icon: LucideIcon
  tools: Tool[]
}

const categories: Category[] = [
  {
    name: "开发工具",
    icon: Code2Icon,
    tools: [
      {
        name: "JSON 对比",
        description: "两个 JSON 逐行对比差异，新增/删除高亮标注",
        href: "/tools/json-diff",
        icon: ArrowRightLeftIcon,
      },
      {
        name: "JSON 转 TS 类型",
        description: "将 JSON 数据自动转换为 TypeScript interface 定义",
        href: "/tools/json-to-ts",
        icon: BracesIcon,
      },
    ],
  },
  {
    name: "设计工具",
    icon: PenToolIcon,
    tools: [
      {
        name: "颜色转换",
        description: "颜色选择器，HEX / RGB / HSL 互转，一键复制",
        href: "/tools/color",
        icon: PaletteIcon,
      },
    ],
  },
  {
    name: "图片工具",
    icon: ImageIcon,
    tools: [
      {
        name: "图片水印",
        description: "给图片添加文字水印，支持位置、颜色、透明度调节",
        href: "/tools/watermark",
        icon: ImageIcon,
      },
    ],
  },
  {
    name: "网络工具",
    icon: GlobeIcon,
    tools: [
      {
        name: "IP 地址查询",
        description: "查询 IP 地址的地理位置、运营商等信息",
        href: "/tools/ip-lookup",
        icon: MapPinIcon,
      },
    ],
  },
  {
    name: "生活工具",
    icon: CoffeeIcon,
    tools: [
      {
        name: "地图定位",
        description: "输入经纬度坐标在地图上显示位置，支持 GPS 定位",
        href: "/tools/map",
        icon: MapIcon,
      },
      {
        name: "天气查询",
        description: "查询城市天气，温度/风速/湿度/能见度",
        href: "/tools/weather",
        icon: CloudSunIcon,
      },
    ],
  },
]

export default function ToolsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pt-8 pb-20 sm:px-6 sm:pt-16 sm:pb-24">
      <header className="mb-8">
        <h1 className="text-xl font-semibold">工具</h1>
        <p className="mt-1 text-sm text-muted-foreground">实用在线工具集</p>
      </header>

      <div className="space-y-8">
        {categories.map((cat) => (
          <section key={cat.name}>
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground/80">
              <cat.icon className="size-4" />
              {cat.name}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {cat.tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <tool.icon className="size-5 text-muted-foreground" />
                  <h3 className="mt-2 font-medium group-hover:text-primary">{tool.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
