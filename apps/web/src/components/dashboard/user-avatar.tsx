import { cn } from "@repo/ui/lib/utils"
import type { SessionUser } from "@/lib/auth"

export function UserAvatar({
  user,
  className,
}: {
  user: SessionUser
  className?: string
}) {
  if (user.image) {
    return (
      <img
        src={user.image}
        alt=""
        draggable={false}
        className={cn("size-8 shrink-0 rounded-full object-cover", className)}
      />
    )
  }

  return (
    <span
      aria-hidden
      className={cn(
        "bg-sidebar-primary text-sidebar-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium select-none",
        className,
      )}
    >
      {(user.name || user.email).charAt(0).toUpperCase()}
    </span>
  )
}
