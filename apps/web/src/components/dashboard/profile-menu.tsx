import { LogOutIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover"
import { Spinner } from "@/components/common/spinner"
import { UserAvatar } from "@/components/dashboard/user-avatar"
import { useSignOut } from "@/hooks/mutations/use-sign-out"
import type { ComponentProps } from "react"
import type { SessionUser } from "@/lib/auth"

type Placement = Pick<ComponentProps<typeof PopoverContent>, "side" | "align">

export function ProfileMenu({
  user,
  side = "bottom",
  align = "end",
}: { user: SessionUser } & Placement) {
  const signOut = useSignOut()

  return (
    <Popover>
      <PopoverTrigger
        aria-label="Account"
        className="focus-visible:ring-ring/50 cursor-pointer rounded-full transition-opacity hover:opacity-85 focus-visible:ring-3 focus-visible:outline-none"
      >
        <UserAvatar user={user} className="size-7 text-xs" />
      </PopoverTrigger>
      <PopoverContent side={side} align={align}>
        <div className="px-2.5 py-2">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="text-muted-foreground truncate text-xs">{user.email}</p>
        </div>
        <div className="bg-border my-1 h-px" />
        <button
          type="button"
          disabled={signOut.isPending}
          onClick={() => signOut.mutate()}
          className="hover:bg-muted focus-visible:ring-ring/50 flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 text-sm focus-visible:ring-3 focus-visible:outline-none disabled:opacity-50"
        >
          {signOut.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <LogOutIcon className="size-4" aria-hidden />
          )}
          Sign out
        </button>
        {signOut.error && (
          <p role="alert" className="text-destructive px-2.5 py-1.5 text-xs">
            {signOut.error.message}
          </p>
        )}
      </PopoverContent>
    </Popover>
  )
}
