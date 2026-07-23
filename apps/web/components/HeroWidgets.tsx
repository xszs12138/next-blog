import { IconCloud } from "@workspace/ui/components/icon-cloud"
import { MorphingText } from "@workspace/ui/components/morphing-text"

const slugs = [
  "typescript",
  "javascript",
  "dart",
  "java",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "express",
]

export function HeroCloud() {
  const images = slugs.map(
    (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`
  )

  return (
    <div className="relative z-3 flex size-full items-center justify-center overflow-hidden">
      <IconCloud
        images={images}
        centerImage="https://bu.dusays.com/2026/03/20/69bd4639921b2.jpg"
      />
    </div>
  )
}

const texts = ["Gaming", "Coding", "Tools", "All You Need"]

export function HeroText() {
  return <MorphingText className="font-medium" texts={texts} />
}
