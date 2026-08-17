import type { ComponentProps } from "react"
import type { LucideIcon } from "lucide-react"
import { AppWindow, Database, Server } from "lucide-react"
import { AsciiCube, CORNERS, CUBE_REVEAL_MS, FACE_CENTERS } from "./ascii-cube"

type Point = { x: number; y: number }
type Face = keyof typeof FACE_CENTERS
type Edge = "left" | "right" | "top" | "bottom"

type Callout = {
  icon: LucideIcon
  title: string
  body: string
  center: Point
  from: Face
  enter: Edge
}

const CUBE = 520
const CARD = { w: 226, h: 88, r: 12, padX: 18, gap: 26, icon: 26, ink: 14 }
const PAD = 28

const CALLOUTS: readonly Callout[] = [
  {
    icon: Server,
    title: "apps/api",
    body: "Hono on Workers",
    center: { x: 300, y: -270 },
    from: "top",
    enter: "left",
  },
  {
    icon: Database,
    title: "packages/db",
    body: "Drizzle on Neon",
    center: { x: -340, y: -55 },
    from: "left",
    enter: "bottom",
  },
  {
    icon: AppWindow,
    title: "apps/web",
    body: "React, TanStack",
    center: { x: 285, y: 185 },
    from: "right",
    enter: "top",
  },
]

const stage = ([x, y]: readonly [number, number]): Point => ({
  x: (x - 0.5) * CUBE,
  y: (y - 0.5) * CUBE,
})

const corner = ({ center }: Callout): Point => ({
  x: center.x - CARD.w / 2,
  y: center.y - CARD.h / 2,
})

const entry = ({ center, enter }: Callout): Point => ({
  x:
    center.x +
    (enter === "left" ? -CARD.w / 2 : enter === "right" ? CARD.w / 2 : 0),
  y:
    center.y +
    (enter === "top" ? -CARD.h / 2 : enter === "bottom" ? CARD.h / 2 : 0),
})

const route = (callout: Callout): [Point, Point, Point] => {
  const from = stage(FACE_CENTERS[callout.from])
  const to = entry(callout)
  const sideways = callout.enter === "left" || callout.enter === "right"
  return [from, sideways ? { x: from.x, y: to.y } : { x: to.x, y: from.y }, to]
}

const EXTENT = [
  ...CORNERS.map(stage),
  ...CALLOUTS.flatMap((callout) => {
    const { x, y } = corner(callout)
    return [
      { x, y },
      { x: x + CARD.w, y: y + CARD.h },
    ]
  }),
]

const MIN_X = Math.min(...EXTENT.map((p) => p.x)) - PAD
const MIN_Y = Math.min(...EXTENT.map((p) => p.y)) - PAD
const MAX_X = Math.max(...EXTENT.map((p) => p.x)) + PAD
const MAX_Y = Math.max(...EXTENT.map((p) => p.y)) + PAD

const VIEW_BOX = `0 0 ${MAX_X - MIN_X} ${MAX_Y - MIN_Y}`

const place = ({ x, y }: Point): Point => ({ x: x - MIN_X, y: y - MIN_Y })

const CUBE_AT = place({ x: -CUBE / 2, y: -CUBE / 2 })

const legs = (callout: Callout) => {
  const [from, elbow, to] = route(callout)
  return [
    { from: place(from), to: place(elbow) },
    { from: place(elbow), to: place(to) },
  ].map((leg) => ({ ...leg, axis: leg.from.x === leg.to.x ? "y" : "x" }))
}

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"

const INK = "var(--color-primary)"
const TEXT_X = CARD.padX + CARD.icon + CARD.ink

const STEP = {
  cube: 0,
  wire: CUBE_REVEAL_MS - 130,
  stagger: 110,
  leg: [240, 170],
  card: 280,
  overlap: 20,
} as const

const wireAt = (index: number) => STEP.wire + index * STEP.stagger
const cardAt = (index: number) =>
  wireAt(index) + STEP.leg[0] + STEP.leg[1] - STEP.overlap

export function BrandDiagram(props: ComponentProps<"svg">) {
  return (
    <svg viewBox={VIEW_BOX} aria-hidden data-brand-diagram {...props}>
      <g transform={`translate(${CUBE_AT.x} ${CUBE_AT.y})`}>
        <AsciiCube size={CUBE} revealFrom={STEP.cube} />
      </g>

      <g
        stroke="currentColor"
        strokeOpacity={0.55}
        strokeWidth={1.5}
        strokeDasharray="4 5"
        vectorEffect="non-scaling-stroke"
      >
        {CALLOUTS.map((callout, index) =>
          legs(callout).map(({ from, to, axis }, leg) => (
            <line
              key={`${callout.title}-${leg}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              style={{
                transformOrigin: `${from.x}px ${from.y}px`,
                animation: `brand-wire-${axis} ${STEP.leg[leg]}ms ${
                  wireAt(index) + (leg ? STEP.leg[0] : 0)
                }ms backwards`,
              }}
            />
          )),
        )}
      </g>

      <g fontFamily={MONO} dominantBaseline="central">
        {CALLOUTS.map((callout, index) => {
          const { x, y } = place(corner(callout))
          const mid = place(callout.center)
          const landing = place(entry(callout))
          const Icon = callout.icon
          return (
            <g
              key={callout.title}
              style={{
                transformOrigin: `${landing.x}px ${landing.y}px`,
                animation: `brand-card ${STEP.card}ms ${cardAt(index)}ms backwards`,
              }}
            >
              <rect
                x={x}
                y={y}
                width={CARD.w}
                height={CARD.h}
                rx={CARD.r}
                fill="white"
              />
              <Icon
                x={x + CARD.padX}
                y={mid.y - CARD.icon / 2}
                size={CARD.icon}
                strokeWidth={1.75}
                stroke={INK}
              />
              <text
                x={x + TEXT_X}
                y={mid.y - CARD.gap / 2}
                fontSize={17}
                fill={INK}
              >
                {callout.title}
              </text>
              <text
                x={x + TEXT_X}
                y={mid.y + CARD.gap / 2}
                fontSize={15}
                fill={INK}
                fillOpacity={0.65}
              >
                {callout.body}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}
