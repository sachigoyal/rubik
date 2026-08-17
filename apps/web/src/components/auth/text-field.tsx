import type { ComponentProps, ReactNode } from "react"
import { Input } from "@repo/ui/components/input"
import { cn } from "@repo/ui/lib/utils"
import { onPrimary } from "./on-primary"

export function TextField({
  label,
  name,
  trailing,
  hint,
  ...props
}: {
  label: string
  name: string
  trailing?: ReactNode
  hint?: string
} & Omit<ComponentProps<"input">, "id">) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={name} className="text-sm font-medium">
          {label}
        </label>
        {trailing}
      </div>
      <Input
        id={name}
        name={name}
        className={cn("h-11", onPrimary.input)}
        aria-describedby={hint ? `${name}-hint` : undefined}
        {...props}
      />
      {hint && (
        <p id={`${name}-hint`} className={cn("text-xs", onPrimary.muted)}>
          {hint}
        </p>
      )}
    </div>
  )
}
