import type { ReactNode } from "react"

export function AuthHeading({
  title,
  children,
}: {
  title: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-semibold tracking-[-0.025em]">{title}</h1>
      {children && (
        <p className="text-sm leading-relaxed text-white/70">{children}</p>
      )}
    </div>
  )
}
