import {
  ActivityIcon,
  FolderIcon,
  ListTodoIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"
import { MotionConfig } from "motion/react"
import { cn } from "@repo/ui/lib/utils"
import { Wordmark } from "@/components/brand/wordmark"
import { ModeToggle } from "@/components/common/mode-toggle"
import { NavItem, type NavEntry } from "@/components/dashboard/nav-item"
import { ProfileMenu } from "@/components/dashboard/profile-menu"
import type { SessionUser } from "@/lib/auth"

const NAV: NavEntry[] = [
  { label: "Tasks", icon: ListTodoIcon, to: "/dashboard" },
  { label: "Projects", icon: FolderIcon },
  { label: "Activity", icon: ActivityIcon },
  { label: "Members", icon: UsersIcon },
  { label: "Settings", icon: SettingsIcon },
]

export function Sidebar({
  user,
  className,
}: {
  user: SessionUser
  className?: string
}) {
  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground border-sidebar-border sticky top-0 flex h-svh flex-col gap-8 border-r px-4 py-6",
        className,
      )}
    >
      <Wordmark className="mx-2.5 focus-visible:ring-sidebar-ring/50" />
      <MotionConfig reducedMotion="user">
        <nav aria-label="Dashboard">
          <ul className="flex flex-col gap-0.5">
            {NAV.map((entry) => (
              <NavItem key={entry.label} {...entry} />
            ))}
          </ul>
        </nav>
      </MotionConfig>
      <div className="mt-auto flex items-center justify-between px-1.5">
        <ModeToggle />
        <ProfileMenu user={user} side="top" align="end" />
      </div>
    </aside>
  )
}
