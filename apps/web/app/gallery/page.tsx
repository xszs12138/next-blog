import type { Metadata } from "next"
import { HideScrollbar } from "@/components/HideScrollbar"
import { GalleryGrid } from "@/components/GalleryGrid"

export const metadata: Metadata = {
  title: "图库",
  description: "图片展示",
}

const images = [
  {
    id: "1",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    url: "#",
    height: 400,
  },
  {
    id: "2",
    img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80",
    url: "#",
    height: 300,
  },
  {
    id: "3",
    img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
    url: "#",
    height: 350,
  },
  {
    id: "4",
    img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80",
    url: "#",
    height: 500,
  },
  {
    id: "5",
    img: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&q=80",
    url: "#",
    height: 280,
  },
  {
    id: "6",
    img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80",
    url: "#",
    height: 420,
  },
  {
    id: "7",
    img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80",
    url: "#",
    height: 320,
  },
  {
    id: "8",
    img: "https://images.unsplash.com/photo-1518173946687-a1e4e3e6a4b0?w=600&q=80",
    url: "#",
    height: 380,
  },
  {
    id: "9",
    img: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&q=80",
    url: "#",
    height: 460,
  },
  {
    id: "10",
    img: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=600&q=80",
    url: "#",
    height: 340,
  },
  {
    id: "11",
    img: "https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=600&q=80",
    url: "#",
    height: 440,
  },
  {
    id: "12",
    img: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600&q=80",
    url: "#",
    height: 360,
  },
]

export default function GalleryPage() {
  return (
    <>
      <HideScrollbar />
      <main className="mx-auto w-full max-w-7xl px-4 pt-8 pb-20 sm:px-6 sm:pt-16 sm:pb-24">
        <GalleryGrid images={images} />
      </main>
    </>
  )
}
