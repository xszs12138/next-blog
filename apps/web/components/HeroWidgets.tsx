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

const texts = ["Gaming", "Coding", "Tools", "All You Need"]

export function HeroText() {
  return <MorphingText className="font-medium" texts={texts} />
}

export function HeroShinyText() {
  return (
    <ShinyText
      text="Gaming · Coding · Tools · All You Need"
      speed={3}
      className="text-center text-2xl font-bold sm:text-3xl"
    />
  )
}
