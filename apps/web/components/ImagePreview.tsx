"use client"

import { useState } from "react"
import Image from "next/image"
import { XIcon } from "lucide-react"

import { Dialog, DialogContent } from "@workspace/ui/components/dialog"

type ImagePreviewProps = {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export function ImagePreview({
  src,
  alt,
  width = 720,
  height = 400,
  className,
}: ImagePreviewProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-zoom-in overflow-hidden rounded-lg border border-border"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          unoptimized
          className={className}
        />
      </button>

      <DialogContent
        showCloseButton={false}
        className="border-0 bg-transparent p-0 shadow-none sm:max-w-3xl"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute -top-10 right-0 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        >
          <XIcon className="size-5" />
        </button>
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          unoptimized
          className="max-h-[85vh] w-full rounded-lg object-contain"
          sizes="(max-width: 768px) 90vw, 48rem"
        />
      </DialogContent>
    </Dialog>
  )
}
