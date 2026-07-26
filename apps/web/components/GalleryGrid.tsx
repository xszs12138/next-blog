"use client"

import { useState } from "react"
import Masonry from "@/components/Masonry"
import { Lightbox } from "@/components/Lightbox"

type ImageItem = {
  id: string
  img: string
  url: string
  height: number
}

type GalleryGridProps = {
  images: ImageItem[]
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [preview, setPreview] = useState<string | null>(null)

  return (
    <>
      <div className="min-h-[600px]">
        <Masonry
          items={images}
          animateFrom="bottom"
          blurToFocus
          scaleOnHover
          onItemClick={(item) => setPreview(item.img)}
        />
      </div>
      <Lightbox src={preview} onClose={() => setPreview(null)} />
    </>
  )
}
