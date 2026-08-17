import type { CSSProperties } from "react"

type Pt = readonly [number, number]

const DEG = Math.PI / 180
const R = 0.42
const PER_EDGE = 5

const v = (deg: number): Pt => [
  0.5 + R * Math.cos(deg * DEG),
  0.5 - R * Math.sin(deg * DEG),
]

const TOP = v(90)
const UR = v(30)
const LR = v(330)
const BOT = v(270)
const LL = v(210)
const UL = v(150)
const C: Pt = [0.5, 0.5]

const PLOT: readonly (readonly [Pt, number])[] = [
  [C, 0],
  [UL, 1],
  [UR, 1],
  [BOT, 1],
  [TOP, 2],
  [LL, 2],
  [LR, 2],
]

export const CORNERS: readonly Pt[] = PLOT.map(([point]) => point)

const centroid = (...pts: Pt[]): Pt => [
  pts.reduce((sum, p) => sum + p[0], 0) / pts.length,
  pts.reduce((sum, p) => sum + p[1], 0) / pts.length,
]

export const FACE_CENTERS = {
  top: centroid(TOP, UR, C, UL),
  left: centroid(UL, C, BOT, LL),
  right: centroid(C, UR, LR, BOT),
} as const

const upright = (deg: number) =>
  deg > 90 ? deg - 180 : deg <= -90 ? deg + 180 : deg

const dashes = (a: Pt, b: Pt, hop: number) => {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const rot = upright(Math.atan2(dy, dx) / DEG)
  return Array.from({ length: PER_EDGE }, (_, i) => {
    const t = (i + 0.5) / PER_EDGE
    return { x: a[0] + t * dx, y: a[1] + t * dy, rot, hop, t }
  })
}

export const DASHES = [
  [C, UL, 0],
  [C, UR, 0],
  [C, BOT, 0],
  [UL, TOP, 1],
  [UR, TOP, 1],
  [UL, LL, 1],
  [UR, LR, 1],
  [BOT, LL, 1],
  [BOT, LR, 1],
].flatMap(([a, b, hop]) => dashes(a as Pt, b as Pt, hop as number))

const HOP_MS = 200
const LEAD_MS = 70
const TRAVEL_MS = HOP_MS - LEAD_MS
const DASH_MS = 160
const PLOT_MS = 180

const HOPS = Math.max(...PLOT.map(([, hop]) => hop))

export const CUBE_REVEAL_MS = HOPS * HOP_MS + PLOT_MS

export function AsciiCube({
  size = 160,
  revealFrom,
}: {
  size?: number
  revealFrom?: number
}) {
  const fs = size * 0.05
  const from = revealFrom ?? 0

  const dashStyle = ({ x, y, rot, hop, t }: (typeof DASHES)[number]) =>
    ({
      "--rot": `${rot}deg`,
      transformOrigin: `${x * size}px ${y * size}px`,
      transform: "rotate(var(--rot))",
      animation:
        revealFrom === undefined
          ? undefined
          : `brand-dash ${DASH_MS}ms ${Math.round(
              from + hop * HOP_MS + LEAD_MS + t * TRAVEL_MS,
            )}ms backwards`,
    }) as CSSProperties

  const plotStyle = (x: number, y: number, hop: number) =>
    revealFrom === undefined
      ? undefined
      : ({
          transformOrigin: `${x * size}px ${y * size}px`,
          animation: `brand-plot ${PLOT_MS}ms ${from + hop * HOP_MS}ms backwards`,
        } satisfies CSSProperties)

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Isometric cube drawn with dashes and plus signs"
      style={{ display: "block" }}
    >
      <g
        fill="currentColor"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
        textAnchor="middle"
        dominantBaseline="central"
      >
        <g fontSize={fs}>
          {DASHES.map((d, i) => (
            <g key={i} style={dashStyle(d)}>
              <text x={d.x * size} y={d.y * size}>
                -
              </text>
            </g>
          ))}
        </g>
        <g fontSize={fs * 1.15}>
          {PLOT.map(([[cx, cy], hop], i) => (
            <text
              key={i}
              x={cx * size}
              y={cy * size}
              style={plotStyle(cx, cy, hop)}
            >
              +
            </text>
          ))}
        </g>
      </g>
    </svg>
  )
}
