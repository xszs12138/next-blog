"use client"

import { useEffect, useRef } from "react"

import { cn } from "@workspace/ui/lib/utils"

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  color?: string
  width?: number
  height?: number
  maxOpacity?: number
  /** Maximum redraw frequency. Lower values leave more room for other animations. */
  frameRate?: number
  /** Limits canvas resolution on high-density displays to reduce GPU work. */
  maxDpr?: number
}

type Grid = {
  cols: number
  rows: number
  squares: Float32Array
}

export function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(0, 0, 0)",
  width,
  height,
  className,
  maxOpacity = 0.3,
  frameRate = 24,
  maxDpr = 1.25,
  ...props
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    const context = canvas?.getContext("2d", { alpha: true })
    if (!canvas || !container || !context) return

    const step = squareSize + gridGap
    const frameInterval = 1000 / Math.max(1, frameRate)
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    let grid: Grid | null = null
    let animationFrameId: number | null = null
    let lastFrameTime = 0
    let isInView = false
    let isPageVisible = !document.hidden
    let prefersReducedMotion = reducedMotion.matches
    let isThemeTransitionActive =
      document.documentElement.dataset.magicuiThemeVt === "active"

    const drawSquare = (index: number, clear = true) => {
      if (!grid) return

      const column = Math.floor(index / grid.rows)
      const row = index % grid.rows
      const x = column * step
      const y = row * step

      if (clear) context.clearRect(x, y, squareSize, squareSize)

      context.globalAlpha = grid.squares[index] ?? 0
      context.fillRect(x, y, squareSize, squareSize)
    }

    const drawInitialGrid = () => {
      if (!grid) return

      context.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)
      context.fillStyle = color
      for (let index = 0; index < grid.squares.length; index++) {
        drawSquare(index, false)
      }
      context.globalAlpha = 1
    }

    const resizeCanvas = () => {
      const canvasWidth = width ?? container.clientWidth
      const canvasHeight = height ?? container.clientHeight
      if (canvasWidth <= 0 || canvasHeight <= 0) return

      canvas.width = Math.floor(canvasWidth * dpr)
      canvas.height = Math.floor(canvasHeight * dpr)
      canvas.style.width = `${canvasWidth}px`
      canvas.style.height = `${canvasHeight}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cols = Math.ceil(canvasWidth / step)
      const rows = Math.ceil(canvasHeight / step)
      const squares = new Float32Array(cols * rows)
      for (let index = 0; index < squares.length; index++) {
        squares[index] = Math.random() * maxOpacity
      }

      grid = { cols, rows, squares }
      drawInitialGrid()
    }

    const stop = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
    }

    const canAnimate = () =>
      isInView &&
      isPageVisible &&
      !prefersReducedMotion &&
      !isThemeTransitionActive

    const updateSquares = (elapsedSeconds: number) => {
      if (!grid) return

      const updates = Math.min(
        grid.squares.length,
        Math.round(grid.squares.length * flickerChance * elapsedSeconds)
      )

      for (let update = 0; update < updates; update++) {
        const index = Math.floor(Math.random() * grid.squares.length)
        if (index === undefined) continue

        grid.squares[index] = Math.random() * maxOpacity
        drawSquare(index)
      }
      context.globalAlpha = 1
    }

    const animate = (time: number) => {
      if (!canAnimate()) {
        animationFrameId = null
        return
      }

      animationFrameId = requestAnimationFrame(animate)
      if (time - lastFrameTime < frameInterval) return

      const elapsedSeconds =
        lastFrameTime === 0
          ? frameInterval / 1000
          : (time - lastFrameTime) / 1000
      lastFrameTime = time
      updateSquares(elapsedSeconds)
    }

    const start = () => {
      if (!canAnimate() || animationFrameId !== null) return
      lastFrameTime = 0
      animationFrameId = requestAnimationFrame(animate)
    }

    const resizeObserver = new ResizeObserver(resizeCanvas)
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isInView = entry?.isIntersecting ?? false
        if (isInView) start()
        else stop()
      },
      { threshold: 0 }
    )

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden
      if (isPageVisible) start()
      else stop()
    }

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches
      if (prefersReducedMotion) stop()
      else start()
    }

    const themeTransitionObserver = new MutationObserver(() => {
      isThemeTransitionActive =
        document.documentElement.dataset.magicuiThemeVt === "active"
      if (isThemeTransitionActive) stop()
      else start()
    })

    resizeCanvas()
    resizeObserver.observe(container)
    intersectionObserver.observe(container)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    reducedMotion.addEventListener("change", handleReducedMotionChange)
    themeTransitionObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-magicui-theme-vt"],
    })

    return () => {
      stop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      reducedMotion.removeEventListener("change", handleReducedMotionChange)
      themeTransitionObserver.disconnect()
    }
  }, [
    color,
    flickerChance,
    frameRate,
    gridGap,
    height,
    maxDpr,
    maxOpacity,
    squareSize,
    width,
  ])

  return (
    <div
      ref={containerRef}
      className={cn("h-full w-full", className)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none block"
      />
    </div>
  )
}
