import { useId } from "react"
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { motion, MotionConfig } from "motion/react"
import { cn } from "@repo/ui/lib/utils"
import { useTheme } from "@/components/theme-provider"
import type { Theme } from "@/components/theme-provider"

const MODES = [
  { value: "system", label: "System theme", Icon: MonitorIcon },
  { value: "light", label: "Light theme", Icon: SunIcon },
  { value: "dark", label: "Dark theme", Icon: MoonIcon },
] as const satisfies readonly {
  value: Theme
  label: string
  Icon: typeof MonitorIcon
}[]

export function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const layoutId = useId()

  return (
    <MotionConfig reducedMotion="user">
      <div
        role="radiogroup"
        aria-label="Theme"
        className={cn(
          "bg-muted relative flex h-6 items-center rounded-full p-0.5",
          className,
        )}
      >
        {MODES.map(({ value, label, Icon }) => {
          const active = theme === value
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={label}
              onClick={() => setTheme(value)}
              className="focus-visible:ring-ring/50 relative z-10 flex size-5 cursor-pointer items-center justify-center rounded-full focus-visible:ring-3 focus-visible:outline-none"
            >
              {active && (
                <motion.div
                  layoutId={layoutId}
                  className="bg-background absolute inset-0 rounded-full shadow-sm"
                  transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                />
              )}
              <Icon
                className={cn(
                  "relative z-10 size-3",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              />
            </button>
          )
        })}
      </div>
    </MotionConfig>
  )
}
