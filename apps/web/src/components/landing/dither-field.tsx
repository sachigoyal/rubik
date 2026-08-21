import { useEffect, useRef } from "react"

// prettier-ignore
export const BAYER = [
   0, 32,  8, 40,  2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44,  4, 36, 14, 46,  6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
   3, 35, 11, 43,  1, 33,  9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47,  7, 39, 13, 45,  5, 37,
  63, 31, 55, 23, 61, 29, 53, 21,
]

export const CELL = 7
const CLEAR = 0.55
const FULL = 1.5
const PEAK = 0.72

export function DitherField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    const paint = () => {
      const { clientWidth: width, clientHeight: height } = canvas
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, width, height)
      context.fillStyle = "rgb(255 255 255 / 0.14)"

      const columns = Math.ceil(width / CELL)
      const rows = Math.ceil(height / CELL)
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const dx = ((column + 0.5) * CELL - width / 2) / (width / 2)
          const dy = ((row + 0.5) * CELL - height / 2) / (height / 2)
          const distance = Math.hypot(dx, dy)

          const ramp = Math.min(
            Math.max((distance - CLEAR) / (FULL - CLEAR), 0),
            1,
          )
          const density = Math.pow(ramp, 2) * PEAK

          const threshold = (BAYER[(row % 8) * 8 + (column % 8)]! + 0.5) / 64
          if (density > threshold) {
            context.fillRect(column * CELL, row * CELL, CELL - 1, CELL - 1)
          }
        }
      }
    }

    const observer = new ResizeObserver(paint)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  return <canvas ref={canvasRef} aria-hidden className={className} />
}
