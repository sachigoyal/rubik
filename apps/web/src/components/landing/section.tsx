import type { ReactNode } from "react"
import { Reveal } from "./reveal"
import { useInView } from "./use-in-view"

export function Section({
  title,
  children,
}: {
  title: string
  children: (shown: boolean) => ReactNode
}) {
  const { ref, shown } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      className="border-t px-6 py-20 sm:px-10 sm:py-24 lg:px-14"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-20">
        <div className="flex flex-col gap-5">
          <Reveal shown={shown}>
            <h2 className="text-3xl font-medium tracking-tighter sm:text-4xl">
              {title}
            </h2>
          </Reveal>
        </div>
        <div>{children(shown)}</div>
      </div>
    </section>
  )
}
