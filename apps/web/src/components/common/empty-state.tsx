import type { LucideIcon } from "lucide-react"

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-dashed px-6 py-12 text-center">
      <Icon className="text-muted-foreground mb-2 size-5" aria-hidden />
      <p className="text-sm font-medium">{title}</p>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </div>
  )
}
