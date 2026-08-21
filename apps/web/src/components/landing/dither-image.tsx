import type { CSSProperties } from "react"
import { useEffect, useRef } from "react"
import { BAYER, CELL } from "./dither-field"

const SHADOW = 0.24
const LIGHT = 0.88
const FLOOR = 0.16

const DURATION = 700
const FRONT = 0.35

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

export function DitherImage({
  src,
  cell = CELL,
  revealFrom,
  sweep = "ltr",
  className,
  style,
}: {
  src: string
  cell?: number
  revealFrom?: number
  sweep?: "ltr" | "rtl"
  className?: string
  style?: CSSProperties
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    const image = new Image()
    image.src = src

    let columns = 0
    let rows = 0
    let density: Float32Array | null = null

    const sample = () => {
      const { clientWidth: width, clientHeight: height } = canvas
      density = null
      if (!width || !height) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      columns = Math.ceil(width / cell)
      rows = Math.ceil(height / cell)
      const sampler = document.createElement("canvas")
      sampler.width = columns
      sampler.height = rows
      const scaled = sampler.getContext("2d")
      if (!scaled) return
      scaled.drawImage(image, 0, 0, columns, rows)
      const { data } = scaled.getImageData(0, 0, columns, rows)

      density = new Float32Array(columns * rows)
      for (let index = 0; index < density.length; index++) {
        const at = index * 4
        const alpha = data[at + 3]! / 255
        if (alpha < 0.04) continue
        const luma =
          (0.2126 * data[at]! +
            0.7152 * data[at + 1]! +
            0.0722 * data[at + 2]!) /
          255
        const shade = Math.min(
          Math.max((luma - SHADOW) / (LIGHT - SHADOW), 0),
          1,
        )
        density[index] = alpha * (FLOOR + (1 - FLOOR) * shade)
      }
    }

    const paint = (progress: number) => {
      if (!density) return
      context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
      context.fillStyle = "rgb(255 255 255 / 0.85)"

      const head = progress * (1 + FRONT)
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const cellDensity = density[row * columns + column]!
          if (cellDensity <= 0) continue

          const along = (column + 0.5) / columns
          const reach = sweep === "rtl" ? 1 - along : along
          const local = Math.min(Math.max((head - reach) / FRONT, 0), 1)
          if (local === 0) continue

          const threshold = (BAYER[(row % 8) * 8 + (column % 8)]! + 0.5) / 64
          if (cellDensity * local <= threshold) continue

          const size = (cell - 1) * (0.3 + 0.7 * local)
          const inset = (cell - 1 - size) / 2
          context.fillRect(
            column * cell + inset,
            row * cell + inset,
            size,
            size,
          )
        }
      }
    }

    let observer: ResizeObserver | undefined
    let cancelled = false
    let timer = 0
    let frame = 0
    let start: number | null = null
    let progress = 1

    const animate = (now: number) => {
      start ??= now
      const t = Math.min((now - start) / DURATION, 1)
      progress = easeOutCubic(t)
      paint(progress)
      if (t < 1) frame = requestAnimationFrame(animate)
    }

    image
      .decode()
      .then(() => {
        if (cancelled) return
        canvas.style.aspectRatio = `${image.naturalWidth} / ${image.naturalHeight}`

        const still = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches
        const animated = revealFrom !== undefined && !still
        progress = animated ? 0 : 1

        observer = new ResizeObserver(() => {
          sample()
          paint(progress)
        })
        observer.observe(canvas)
        if (animated) {
          timer = window.setTimeout(() => {
            frame = requestAnimationFrame(animate)
          }, revealFrom)
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [src, cell, revealFrom, sweep])

  return (
    <canvas ref={canvasRef} aria-hidden className={className} style={style} />
  )
}
