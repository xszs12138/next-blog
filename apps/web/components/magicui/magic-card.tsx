"use client"

import type { HTMLAttributes, MouseEvent, ReactNode } from "react"
import { useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

type MagicCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  gradientSize?: number
  gradientOpacity?: number
  gradientFrom?: string
  gradientTo?: string
}

export function MagicCard({
  children,
  className,
  gradientSize = 180,
  gradientOpacity = 0.2,
  gradientFrom = "rgba(255, 255, 255, 0.28)",
  gradientTo = "rgba(255, 255, 255, 0)",
  onMouseMove,
  onMouseLeave,
  ...props
}: MagicCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    setPosition({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    })
    onMouseMove?.(event)
  }

  function handleMouseLeave(event: MouseEvent<HTMLDivElement>) {
    setIsHovering(false)
    onMouseLeave?.(event)
  }

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovering ? gradientOpacity : 0,
          background: `radial-gradient(${gradientSize}px circle at ${position.x}px ${position.y}px, ${gradientFrom}, ${gradientTo} 68%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
