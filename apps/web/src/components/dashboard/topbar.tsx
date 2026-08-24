import { cn } from "@repo/ui/lib/utils"
import { Wordmark } from "@/components/brand/wordmark"
import { ModeToggle } from "@/components/common/mode-toggle"
import { ProfileMenu } from "@/components/dashboard/profile-menu"
import type { SessionUser } from "@/lib/auth"

export function Topbar({
  user,
  className,
}: {
  user: SessionUser
  className?: string
}) {
  return (
    <header
      className={cn(
        "flex items-center justify-between border-b px-6 py-4",
        className,
      )}
    >
      <Wordmark />
      <div className="flex items-center gap-3">
        <ModeToggle />
        <ProfileMenu user={user} />
      </div>
    </header>
  )
}
