import { cn } from "@repo/ui/lib/utils"

const HEX = "M16 3 L27.26 9.5 L27.26 22.5 L16 29 L4.74 22.5 L4.74 9.5 Z"
const PERIMETER = 78
const ARC = PERIMETER / 3
const CYCLE_MS = 1080

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      data-rubik-spinner
      className={cn("size-4", className)}
      aria-hidden
    >
      <path d={HEX} data-track opacity={0.25} />
      <path
        d={HEX}
        data-arc
        strokeDasharray={`${ARC} ${PERIMETER - ARC}`}
        style={{ animation: `rubik-trace ${CYCLE_MS}ms linear infinite` }}
      />
    </svg>
  )
}
