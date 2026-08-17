import type { ComponentProps } from "react"
import { Link } from "@tanstack/react-router"
import { cn } from "@repo/ui/lib/utils"

export function AuthLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "focus-visible:ring-white/40 rounded-sm underline underline-offset-4 hover:text-white focus-visible:ring-3 focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  )
}
