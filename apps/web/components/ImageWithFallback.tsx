"use client"

import { useEffect, useState } from "react"
import Image, { type ImageProps } from "next/image"
import { ImageOffIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

type ImageStatus = "loading" | "loaded" | "error"

type SharedImageProps = {
  containerClassName?: string
  fallbackClassName?: string
  fallbackLabel?: string
}

function ImagePlaceholder({
  alt,
  className,
  status,
  fallbackLabel,
}: {
  alt: string
  className?: string
  status: ImageStatus
  fallbackLabel?: string
}) {
  if (status === "loaded") return null

  if (status === "loading") {
    return (
      <span
        aria-hidden="true"
        className={cn("absolute inset-0 animate-pulse bg-muted", className)}
      />
    )
  }

  return (
    <span
      role={alt ? "img" : undefined}
      aria-label={alt ? fallbackLabel ?? `${alt} 加载失败` : undefined}
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground",
        className
      )}
    >
      <ImageOffIcon aria-hidden="true" className="size-1/3 max-h-10 max-w-10" />
    </span>
  )
}

export type ImageWithFallbackProps = ImageProps & SharedImageProps

export function ImageWithFallback({
  alt,
  className,
  containerClassName,
  fallbackClassName,
  fallbackLabel,
  fill,
  onError,
  onLoad,
  src,
  ...props
}: ImageWithFallbackProps) {
  const [status, setStatus] = useState<ImageStatus>("loading")

  useEffect(() => {
    setStatus("loading")
  }, [src])

  return (
    <span
      className={cn(
        "relative isolate overflow-hidden bg-muted",
        fill ? "absolute inset-0" : "inline-block align-middle",
        containerClassName
      )}
    >
      <ImagePlaceholder
        alt={alt}
        status={status}
        className={fallbackClassName}
        fallbackLabel={fallbackLabel}
      />
      <Image
        {...props}
        src={src}
        alt={alt}
        fill={fill}
        onLoad={(event) => {
          setStatus("loaded")
          onLoad?.(event)
        }}
        onError={(event) => {
          setStatus("error")
          onError?.(event)
        }}
        className={cn(
          "transition-opacity duration-300",
          status === "loaded" ? "opacity-100" : "opacity-0",
          className
        )}
      />
    </span>
  )
}

export type NativeImageWithFallbackProps = React.ComponentPropsWithoutRef<"img"> &
  SharedImageProps

export function NativeImageWithFallback({
  alt = "",
  className,
  containerClassName,
  fallbackClassName,
  fallbackLabel,
  onError,
  onLoad,
  src,
  ...props
}: NativeImageWithFallbackProps) {
  const [status, setStatus] = useState<ImageStatus>("loading")

  useEffect(() => {
    setStatus("loading")
  }, [src])

  return (
    <span
      className={cn(
        "relative isolate inline-block overflow-hidden bg-muted align-middle",
        containerClassName
      )}
    >
      <ImagePlaceholder
        alt={alt}
        status={status}
        className={fallbackClassName}
        fallbackLabel={fallbackLabel}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...props}
        src={src}
        alt={alt}
        onLoad={(event) => {
          setStatus("loaded")
          onLoad?.(event)
        }}
        onError={(event) => {
          setStatus("error")
          onError?.(event)
        }}
        className={cn(
          "block transition-opacity duration-300",
          status === "loaded" ? "opacity-100" : "opacity-0",
          className
        )}
      />
    </span>
  )
}
