import { Link, useMatchRoute } from "@tanstack/react-router"
import { motion } from "motion/react"
import { cn } from "@repo/ui/lib/utils"
import type { LinkProps } from "@tanstack/react-router"
import type { LucideIcon } from "lucide-react"

export type NavEntry = {
  label: string
  icon: LucideIcon
  to?: LinkProps["to"]
}

export function NavItem({ label, icon: Icon, to }: NavEntry) {
  const matchRoute = useMatchRoute()

  if (!to) {
    return (
      <li>
        <div
          aria-disabled
          className="text-sidebar-foreground/40 flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-sm select-none"
        >
          <Icon className="size-4" aria-hidden />
          <span>{label}</span>
          <span className="text-sidebar-foreground/35 ml-auto text-xs">
            soon
          </span>
        </div>
      </li>
    )
  }

  const active = Boolean(matchRoute({ to }))

  return (
    <li>
      <Link
        to={to}
        className={cn(
          "focus-visible:ring-sidebar-ring/50 relative flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-sm transition-colors focus-visible:ring-3 focus-visible:outline-none",
          active
            ? "text-sidebar-accent-foreground"
            : "text-sidebar-foreground/70 hover:text-sidebar-foreground",
        )}
      >
        {active && (
          <motion.span
            layoutId="sidebar-active"
            className="bg-sidebar-accent absolute inset-0 rounded-lg"
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          />
        )}
        <Icon className="relative z-10 size-4" aria-hidden />
        <span className="relative z-10">{label}</span>
      </Link>
    </li>
  )
}
