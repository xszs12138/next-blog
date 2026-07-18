import { IconCloud } from "@workspace/ui/components/icon-cloud"

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
    <div className="relative flex size-full items-center justify-center overflow-hidden">
      <IconCloud
        images={images}
        centerImage="https://bu.dusays.com/2026/03/20/69bd4639921b2.jpg"
      />
    </div>
  )
}
