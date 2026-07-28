export const TOOL_CATEGORIES = [
  { id: "development", name: "开发", index: "01" },
  { id: "design", name: "设计与图片", index: "02" },
  { id: "network", name: "网络与生活", index: "03" },
  { id: "resources", name: "网站链接", index: "04" },
] as const

export type ToolCategoryId = (typeof TOOL_CATEGORIES)[number]["id"]

export type ToolFeature = {
  categoryId: ToolCategoryId
  href:
    | "/tools/json-diff"
    | "/tools/code-comparison"
    | "/tools/json-to-ts"
    | "/tools/color"
    | "/tools/watermark"
    | "/tools/ip-lookup"
    | "/tools/map"
    | "/tools/weather"
    | "/tools/websites"
  name: string
  description: string
}

export const TOOL_FEATURES: ToolFeature[] = [
  {
    categoryId: "development",
    name: "代码对比分析",
    description: "逐行查看两段代码的新增与删除，并保留语法高亮",
    href: "/tools/code-comparison",
  },
  {
    categoryId: "development",
    name: "JSON 对比",
    description: "两个 JSON 逐行对比差异，新增与删除高亮标注",
    href: "/tools/json-diff",
  },
  {
    categoryId: "development",
    name: "JSON 转 TS 类型",
    description: "将 JSON 数据自动转换为 TypeScript interface",
    href: "/tools/json-to-ts",
  },
  {
    categoryId: "design",
    name: "颜色转换",
    description: "HEX、RGB 与 HSL 的即时转换和复制",
    href: "/tools/color",
  },
  {
    categoryId: "design",
    name: "图片水印",
    description: "给图片添加可调位置、颜色与透明度的文字水印",
    href: "/tools/watermark",
  },
  {
    categoryId: "network",
    name: "IP 地址查询",
    description: "查询 IP 的地理位置和运营商等信息",
    href: "/tools/ip-lookup",
  },
  {
    categoryId: "network",
    name: "地图定位",
    description: "输入经纬度坐标，在地图中显示位置",
    href: "/tools/map",
  },
  {
    categoryId: "network",
    name: "天气查询",
    description: "查询城市天气、温度、风速与湿度",
    href: "/tools/weather",
  },
  {
    categoryId: "resources",
    name: "常用工具网站链接",
    description: "系统维护、开发与创作时常用的网站、软件与服务",
    href: "/tools/websites",
  },
]

export const TOOL_ROUTE_LABELS = Object.fromEntries(
  TOOL_FEATURES.map(({ href, name }) => [href, name])
)
