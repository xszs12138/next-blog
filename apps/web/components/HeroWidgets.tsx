import { PixelImage } from "@workspace/ui/components/pixel-image"
import { MorphingText } from "@workspace/ui/components/morphing-text"
import ShinyText from "@workspace/ui/components/ShinyText"
import { LiveBadge } from "@/components/LiveBadge"

export function HeroCloud() {
  return (
    <div className="relative z-3 flex size-full items-center justify-center overflow-hidden">
      <div className="relative">
        <PixelImage
          src="https://bu.dusays.com/2026/02/15/69918a5bbfefa.webp"
          grid="4x6"
          className="size-50 overflow-hidden [&_img]:object-cover"
        />
        <LiveBadge />
      </div>
    </div>
  )
}

const texts = ["游戏", "编程", "工具", "所需的一切"]

export function HeroText() {
  return <MorphingText className="font-medium" texts={texts} />
}

export function HeroShinyText() {
  return (
    <ShinyText
      text="游戏 · 编程 · 工具 · 所需的一切"
      speed={3}
      color="var(--muted-foreground)"
      shineColor="var(--foreground)"
      className="text-lg font-medium tracking-wide sm:text-xl"
    />
  )
}
