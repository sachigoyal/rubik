import { useEffect, useRef } from "react"
import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"
import { Button } from "@repo/ui/components/button"
import { AsciiCube } from "@/components/brand/ascii-cube"
import { Wordmark } from "@/components/brand/wordmark"
import { ModeToggle } from "@/components/common/mode-toggle"
import { AuthSection } from "./auth-section"
import { CtaSection } from "./cta-section"
import { DitherField } from "./dither-field"
import { DitherImage } from "./dither-image"
import { SetupSection } from "./setup-section"
import { SocialLinks } from "./social-links"
import { StackSection } from "./stack-section"

const CUBE = 520

const STEP = {
  cube: 150,
  handLeft: 250,
  handRight: 330,
} as const

function useHeroParallax() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0
    const aim = (px: number, py: number) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        node.style.setProperty("--px", px.toFixed(3))
        node.style.setProperty("--py", py.toFixed(3))
      })
    }
    const move = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect()
      aim(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        ((event.clientY - rect.top) / rect.height) * 2 - 1,
      )
    }
    const leave = () => aim(0, 0)

    node.addEventListener("pointermove", move)
    node.addEventListener("pointerleave", leave)
    return () => {
      cancelAnimationFrame(frame)
      node.removeEventListener("pointermove", move)
      node.removeEventListener("pointerleave", leave)
    }
  }, [])

  return ref
}

export function LandingPage() {
  const heroRef = useHeroParallax()

  return (
    <main data-landing>
      <div className="grid h-svh grid-rows-[minmax(0,1fr)_auto]">
        <section
          ref={heroRef}
          className="bg-primary relative overflow-hidden text-white"
        >
          <DitherField className="absolute inset-0 size-full" />

          <div
            data-brand-diagram
            className="flex h-full items-center justify-center"
          >
            <div className="hero-parallax-cube">
              <svg viewBox={`0 0 ${CUBE} ${CUBE}`} className="hero-cube">
                <AsciiCube size={CUBE} revealFrom={STEP.cube} />
              </svg>
            </div>
          </div>

          <div className="hero-hand hero-parallax-hand pointer-events-none absolute top-1/2 -left-6 hidden select-none sm:block">
            <div className="-translate-y-[62%]">
              <DitherImage
                src="/hand-left.png"
                cell={5}
                revealFrom={STEP.handLeft}
                sweep="ltr"
                className="block w-full"
              />
            </div>
          </div>
          <div className="hero-hand hero-parallax-hand pointer-events-none absolute top-1/2 -right-6 hidden select-none sm:block">
            <div className="-translate-y-[42%]">
              <DitherImage
                src="/hand-right.png"
                cell={5}
                revealFrom={STEP.handRight}
                sweep="rtl"
                className="block w-full"
              />
            </div>
          </div>

          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-8 sm:px-10 lg:px-14">
            <Wordmark
              className="focus-visible:ring-white/40"
              markClassName="text-white"
            />
            <SocialLinks
              className="text-white"
              linkClassName="focus-visible:ring-white/40"
            />
          </div>
        </section>

        <section className="flex flex-col gap-8 px-6 py-10 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:px-14 lg:py-14">
          <h1 className="text-4xl font-medium tracking-tighter sm:text-5xl lg:text-6xl">
            Ship fullstack
            <br />
            on <span className="text-cloudflare">Cloudflare</span>.
          </h1>

          <div className="flex flex-col gap-6 lg:max-w-sm">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Hono on Workers, tRPC, Drizzle on Neon, better-auth, and a React
              SPA. Built to scale, stay fast, and behave predictably.
            </p>
            <div className="flex gap-3">
              <Button
                render={<Link to="/sign-up" />}
                className="h-11 rounded-full px-6"
              >
                Get started
                <ArrowRight className="transition-transform duration-200 ease-out motion-safe:group-hover/button:translate-x-0.5" />
              </Button>
              <Button
                variant="outline"
                render={<Link to="/sign-in" />}
                className="h-11 rounded-full px-6"
              >
                Sign in
              </Button>
            </div>
          </div>
        </section>
      </div>

      <StackSection />
      <AuthSection />
      <SetupSection />
      <CtaSection />

      <footer className="flex items-center justify-between border-t px-6 py-8 sm:px-10 lg:px-14">
        <Wordmark className="text-primary" />
        <div className="flex items-center gap-5">
          <p className="text-muted-foreground hidden text-xs sm:block">
            A fullstack template on Cloudflare.
          </p>
          <SocialLinks
            className="text-muted-foreground gap-4"
            linkClassName="hover:text-foreground hover:opacity-100 focus-visible:ring-ring/50 transition-colors"
          />
          <ModeToggle />
        </div>
      </footer>
    </main>
  )
}
