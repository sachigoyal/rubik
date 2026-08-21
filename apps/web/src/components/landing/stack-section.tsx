import { useEffect, useRef, useState } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"
import {
  siBetterauth,
  siCloudflareworkers,
  siDrizzle,
  siHono,
  siNeon,
  siReact,
  siTailwindcss,
  siTanstack,
  siTrpc,
  siVite,
} from "simple-icons"
import { cn } from "@repo/ui/lib/utils"
import { BAYER } from "./dither-field"
import { Reveal } from "./reveal"
import { useInView } from "./use-in-view"

const TECHS = [
  {
    name: "Hono",
    role: "Framework",
    note: "Routing on V8 isolates",
    ink: "text-hono",
    accent: "group-data-[raised]:text-hono",
    icon: siHono.path,
  },
  {
    name: "Cloudflare Workers",
    role: "Runtime",
    note: "Compute at the edge",
    ink: "text-cloudflare",
    accent: "group-data-[raised]:text-cloudflare",
    icon: siCloudflareworkers.path,
  },
  {
    name: "tRPC",
    role: "API",
    note: "End-to-end types, no codegen",
    ink: "text-trpc",
    accent: "group-data-[raised]:text-trpc",
    icon: siTrpc.path,
  },
  {
    name: "Neon",
    role: "Database",
    note: "Serverless Postgres",
    ink: "text-neon",
    accent: "group-data-[raised]:text-neon",
    icon: siNeon.path,
  },
  {
    name: "Drizzle",
    role: "ORM",
    note: "Schema as TypeScript",
    ink: "text-drizzle",
    accent: "group-data-[raised]:text-drizzle",
    icon: siDrizzle.path,
  },
  {
    name: "better-auth",
    role: "Auth",
    note: "Email, GitHub, and Google",
    ink: "text-betterauth",
    accent: "group-data-[raised]:text-betterauth",
    icon: siBetterauth.path,
  },
  {
    name: "React 19",
    role: "Frontend",
    note: "With the React Compiler",
    ink: "text-react",
    accent: "group-data-[raised]:text-react",
    icon: siReact.path,
  },
  {
    name: "TanStack",
    role: "Routing and data",
    note: "Router and Query",
    ink: "text-tanstack",
    accent: "group-data-[raised]:text-tanstack",
    icon: siTanstack.path,
  },
  {
    name: "Tailwind v4",
    role: "UI",
    note: "Design tokens in CSS",
    ink: "text-tailwind",
    accent: "group-data-[raised]:text-tailwind",
    icon: siTailwindcss.path,
  },
  {
    name: "Vite",
    role: "Tooling",
    note: "Dev server and build",
    ink: "text-vite",
    accent: "group-data-[raised]:text-vite",
    icon: siVite.path,
  },
] as const

const GRAIN = 3
const BASE = 0.8
const LOGO = 0.9
const DURATION = 550
const OMEGA = 6600 / DURATION
const STAGGER = 0.35
const DWELL = 1200

const ease = (t: number) => t * t * (3 - 2 * t)

const THRESHOLDS = Float32Array.from(BAYER, (value) => (value + 0.5) / 64)

function CardDither({
  icon,
  raised,
  className,
}: {
  icon: string
  raised: boolean
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const paintRef = useRef<(level: number) => void>(() => {})
  const levelRef = useRef(0)
  const velocityRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    let image: ImageData | null = null
    let pixels: Uint32Array | null = null
    let inkPixel = 0
    const littleEndian = new Uint8Array(new Uint32Array([1]).buffer)[0] === 1

    const probe = document.createElement("canvas")
    probe.width = probe.height = 1
    const probeContext = probe.getContext("2d", { willReadFrequently: true })

    let logo: Float32Array | null = null
    let particles: Float32Array | null = null
    let shape: Float32Array | null = null
    let gridKey = ""
    const rebuild = (
      columns: number,
      rows: number,
      dpr: number,
      height: number,
    ) => {
      const key = `${columns}x${rows}@${dpr}`
      if (gridKey === key) return
      gridKey = key

      logo = new Float32Array(columns * rows)
      const sampler = document.createElement("canvas")
      sampler.width = columns
      sampler.height = rows
      const scaled = sampler.getContext("2d", { willReadFrequently: true })
      if (!scaled) return
      const side = Math.min(columns, rows) * 0.62
      const scale = side / 24
      scaled.setTransform(
        scale,
        0,
        0,
        scale,
        (columns - side) / 2,
        rows * 0.42 - side / 2,
      )
      scaled.fill(new Path2D(icon))
      const { data } = scaled.getImageData(0, 0, columns, rows)
      for (let index = 0; index < logo.length; index++) {
        logo[index] = (data[index * 4 + 3]! / 255) * LOGO
      }

      shape = new Float32Array(rows)
      const bandCdf = new Float32Array(rows)
      let total = 0
      for (let row = 0; row < rows; row++) {
        const depth = 1 - ((row + 0.5) * GRAIN) / height
        const weight = Math.pow(depth, 1.6) * (1 - Math.pow(depth, 8))
        shape[row] = weight
        total += weight
        bandCdf[row] = total
      }

      const cell = GRAIN * dpr
      const found: number[] = []
      for (let row = 0; row < rows; row++) {
        const thresholdRow = (row & 7) * 8
        for (let column = 0; column < columns; column++) {
          const threshold = THRESHOLDS[thresholdRow + (column & 7)]!
          if (logo[row * columns + column]! <= threshold) continue
          const pick = Math.random() * total
          let from = 0
          while (from < rows - 1 && bandCdf[from]! < pick) from++
          found.push(
            Math.random() * columns * cell,
            (from + 0.5) * cell,
            (column + 0.5) * cell,
            (row + 0.5) * cell,
            Math.random() * STAGGER,
          )
        }
      }
      particles = Float32Array.from(found)
    }

    const refreshInk = () => {
      if (!probeContext) return
      probeContext.clearRect(0, 0, 1, 1)
      probeContext.fillStyle = getComputedStyle(canvas).color
      probeContext.fillRect(0, 0, 1, 1)
      const [r, g, b, a] = probeContext.getImageData(0, 0, 1, 1).data
      inkPixel = littleEndian
        ? ((a! << 24) | (b! << 16) | (g! << 8) | r!) >>> 0
        : ((r! << 24) | (g! << 16) | (b! << 8) | a!) >>> 0
    }

    const paint = (level: number) => {
      levelRef.current = level
      const { clientWidth: width, clientHeight: height } = canvas
      if (!width || !height) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const deviceWidth = Math.round(width * dpr)
      const deviceHeight = Math.round(height * dpr)
      if (canvas.width !== deviceWidth) canvas.width = deviceWidth
      if (canvas.height !== deviceHeight) canvas.height = deviceHeight
      if (
        !image ||
        image.width !== deviceWidth ||
        image.height !== deviceHeight
      ) {
        image = new ImageData(deviceWidth, deviceHeight)
        pixels = new Uint32Array(image.data.buffer)
      }
      pixels!.fill(0)

      const columns = Math.ceil(width / GRAIN)
      const rows = Math.ceil(height / GRAIN)
      rebuild(columns, rows, dpr, height)

      const fade = (1 - level) * BASE
      if (fade > 0.005 && shape) {
        for (let row = 0; row < rows; row++) {
          const band = fade * shape[row]!
          if (band <= 0.008) continue

          const local = band > 0.6 ? 1 : band / 0.6
          const size = Math.max(
            1,
            Math.round((GRAIN - 1) * (0.5 + 0.5 * local) * dpr),
          )
          const edge = ((GRAIN - 1) * dpr - size) / 2
          const top = Math.round(edge + row * GRAIN * dpr)
          const bottom = Math.min(top + size, deviceHeight)
          const thresholdRow = (row & 7) * 8

          for (let column = 0; column < columns; column++) {
            const threshold = THRESHOLDS[thresholdRow + (column & 7)]!
            if (band <= threshold) continue

            const left = Math.round(edge + column * GRAIN * dpr)
            const right = Math.min(left + size, deviceWidth)
            for (let y = top; y < bottom; y++) {
              const start = y * deviceWidth + left
              pixels!.fill(inkPixel, start, start + (right - left))
            }
          }
        }
      }

      if (level > 0 && particles) {
        for (let index = 0; index < particles.length; index += 5) {
          const along = Math.min(
            Math.max((level - particles[index + 4]!) / (1 - STAGGER), 0),
            1,
          )
          if (along <= 0) continue
          const eased = ease(along)
          const sx = particles[index]!
          const sy = particles[index + 1]!
          const x = sx + (particles[index + 2]! - sx) * eased
          const y = sy + (particles[index + 3]! - sy) * eased
          const size = Math.max(
            1,
            Math.round((GRAIN - 1) * dpr * (0.55 + 0.45 * eased)),
          )
          const left = Math.max(0, Math.round(x - size / 2))
          const right = Math.min(left + size, deviceWidth)
          const top = Math.max(0, Math.round(y - size / 2))
          const bottom = Math.min(top + size, deviceHeight)
          for (let py = top; py < bottom; py++) {
            const start = py * deviceWidth + left
            pixels!.fill(inkPixel, start, start + (right - left))
          }
        }
      }
      context.putImageData(image, 0, 0)
    }
    paintRef.current = paint

    refreshInk()
    const observer = new ResizeObserver(() => paint(levelRef.current))
    observer.observe(canvas)
    const theme = new MutationObserver(() => {
      refreshInk()
      paint(levelRef.current)
    })
    theme.observe(document.documentElement, { attributeFilter: ["class"] })

    return () => {
      observer.disconnect()
      theme.disconnect()
    }
  }, [icon])

  useEffect(() => {
    const target = raised ? 1 : 0
    const from = levelRef.current
    if (from === target) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      paintRef.current(target)
      return
    }
    let level = from
    let frame = 0
    let last: number | null = null
    const tick = (now: number) => {
      last ??= now
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now
      const acceleration =
        -OMEGA * OMEGA * (level - target) - 2 * OMEGA * velocityRef.current
      velocityRef.current += acceleration * dt
      level += velocityRef.current * dt
      if (
        Math.abs(level - target) < 0.001 &&
        Math.abs(velocityRef.current) < 0.02
      ) {
        velocityRef.current = 0
        paintRef.current(target)
        return
      }
      paintRef.current(Math.min(Math.max(level, 0), 1))
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [raised])

  return <canvas ref={canvasRef} aria-hidden className={className} />
}

function TechCard({
  tech,
  index,
  raised,
  shown,
  delay,
}: {
  tech: (typeof TECHS)[number]
  index: number
  raised: boolean
  shown: boolean
  delay: number
}) {
  return (
    <li className="-ml-px flex-none first:ml-0">
      <Reveal shown={shown} delay={delay} className="h-full">
        <div
          data-tech={index}
          data-raised={raised ? "" : undefined}
          className="group bg-background relative flex h-[min(62svh,36rem)] w-[min(88vw,32rem)] flex-col overflow-hidden border p-8"
        >
          <CardDither
            icon={tech.icon}
            raised={raised}
            className={cn("absolute inset-0 size-full", tech.ink)}
          />
          <span className="text-muted-foreground relative font-mono text-xs">
            {tech.role}
          </span>
          <div className="relative mt-auto">
            <h3
              className={cn(
                "text-3xl font-medium tracking-tight transition-colors duration-300 sm:text-4xl",
                tech.accent,
              )}
            >
              {tech.name}
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">{tech.note}</p>
          </div>
        </div>
      </Reveal>
    </li>
  )
}

export function StackSection() {
  const still = useReducedMotion() ?? false
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const { ref: viewRef, shown } = useInView<HTMLDivElement>()
  const travelRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(-1)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })
  const travel = useMotionValue(0)
  const ratio = useTransform([scrollYProgress, travel], (latest) => {
    const [progress, distance] = latest as [number, number]
    if (distance <= 0) return 0
    const scrolled = progress * (distance + 2 * DWELL) - DWELL
    return Math.min(Math.max(scrolled / distance, 0), 1)
  })
  const x = useTransform(
    [ratio, travel],
    (latest) =>
      -(latest as [number, number])[0] * (latest as [number, number])[1],
  )
  const glide = useSpring(x, { stiffness: 100, damping: 30, mass: 0.8 })
  const progress = useSpring(ratio, {
    stiffness: 100,
    damping: 30,
    mass: 0.8,
  })

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    const spacer = travelRef.current
    if (!section || !track || !spacer || still) return
    const measure = () => {
      const last = track.querySelector<HTMLElement>("li:last-child")
      const center = last
        ? last.offsetLeft + last.offsetWidth / 2
        : track.scrollWidth
      const distance = Math.max(center - section.clientWidth / 2, 0)
      travel.set(distance)
      spacer.style.height = `${distance + 2 * DWELL}px`
    }
    const observer = new ResizeObserver(measure)
    observer.observe(section)
    observer.observe(track)
    return () => observer.disconnect()
  }, [still, travel])

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    const pointer = { x: -1, y: -1 }
    let frame = 0
    const test = () => {
      frame = 0
      const section = sectionRef.current
      if (!section) return
      if (pointer.x < 0) {
        setHovered(-1)
        return
      }
      const bounds = section.getBoundingClientRect()
      if (pointer.y < bounds.top || pointer.y > bounds.bottom) {
        setHovered(-1)
        return
      }
      const card = document
        .elementFromPoint(pointer.x, pointer.y)
        ?.closest<HTMLElement>("[data-tech]")
      setHovered(card ? Number(card.dataset.tech) : -1)
    }
    const queue = () => {
      frame ||= requestAnimationFrame(test)
    }
    const move = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      queue()
    }
    const gone = () => {
      pointer.x = -1
      queue()
    }
    let lastGlide = Number.POSITIVE_INFINITY
    const moved = (value: number) => {
      if (Math.abs(value - lastGlide) < 4) return
      lastGlide = value
      queue()
    }
    window.addEventListener("pointermove", move, { passive: true })
    document.documentElement.addEventListener("pointerleave", gone)
    window.addEventListener("scroll", queue, { passive: true })
    const unsubscribe = glide.on("change", moved)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", move)
      document.documentElement.removeEventListener("pointerleave", gone)
      window.removeEventListener("scroll", queue)
      unsubscribe()
    }
  }, [glide])

  return (
    <section ref={sectionRef} className="relative border-t">
      <div
        ref={viewRef}
        className={cn(
          "flex flex-col gap-10",
          still
            ? "py-20 sm:py-24"
            : "sticky top-0 h-svh justify-center overflow-hidden",
        )}
      >
        <header className="flex items-end justify-between gap-6 px-6 sm:px-10 lg:px-14">
          <Reveal shown={shown}>
            <h2 className="text-3xl font-medium tracking-tighter sm:text-4xl">
              The stack
            </h2>
          </Reveal>
          {!still && (
            <div aria-hidden className="bg-border hidden h-px w-40 sm:block">
              <motion.div
                className="bg-primary h-full origin-left"
                style={{ scaleX: progress }}
              />
            </div>
          )}
        </header>

        <motion.ul
          ref={trackRef}
          style={still ? undefined : { x: glide }}
          className={cn(
            "flex px-6 sm:px-10 lg:px-14",
            still ? "overflow-x-auto pb-4" : "w-max",
          )}
        >
          {TECHS.map((tech, index) => (
            <TechCard
              key={tech.name}
              tech={tech}
              index={index}
              raised={hovered === index}
              shown={shown}
              delay={100 + index * 60}
            />
          ))}
        </motion.ul>
      </div>
      {!still && <div ref={travelRef} aria-hidden />}
    </section>
  )
}
