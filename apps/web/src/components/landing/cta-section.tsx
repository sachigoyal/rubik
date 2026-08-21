import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"
import { Button } from "@repo/ui/components/button"
import { AsciiCube } from "@/components/brand/ascii-cube"
import { Reveal } from "./reveal"
import { useInView } from "./use-in-view"

const CUBE = 520

export function CtaSection() {
  const { ref, shown } = useInView<HTMLElement>()
  const [draw, setDraw] = useState(0)

  return (
    <section ref={ref} className="border-t px-6 py-24 sm:px-10 sm:py-32">
      <Reveal shown={shown} className="flex flex-col items-center gap-8">
        <div
          className="text-primary"
          onPointerEnter={() => setDraw((count) => count + 1)}
        >
          <svg
            viewBox={`0 0 ${CUBE} ${CUBE}`}
            className="size-28 font-semibold sm:size-32"
          >
            <AsciiCube
              key={draw}
              size={CUBE}
              revealFrom={draw ? 0 : undefined}
            />
          </svg>
        </div>
        <h2 className="text-center text-4xl font-medium tracking-tighter sm:text-5xl">
          Try out Rubik now
        </h2>
        <Button
          render={<Link to="/sign-up" />}
          className="h-11 rounded-full px-6"
        >
          Get started
          <ArrowRight className="transition-transform duration-200 ease-out motion-safe:group-hover/button:translate-x-0.5" />
        </Button>
      </Reveal>
    </section>
  )
}
