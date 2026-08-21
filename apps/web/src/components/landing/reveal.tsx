import type { ReactNode } from "react"
import { cn } from "@repo/ui/lib/utils"

export function Reveal({
  shown,
  delay = 0,
  className,
  children,
}: {
  shown: boolean
  delay?: number
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out",
        shown
          ? "translate-y-0 opacity-100"
          : "opacity-0 motion-safe:translate-y-4",
        className,
      )}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
