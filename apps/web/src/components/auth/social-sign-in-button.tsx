import { Button } from "@repo/ui/components/button"
import { Spinner } from "@/components/common/spinner"
import { GithubIcon, GoogleIcon } from "@/components/icons"
import type { SocialProvider } from "@/lib/auth"

const PROVIDERS = {
  github: { label: "GitHub", Icon: GithubIcon },
  google: { label: "Google", Icon: GoogleIcon },
} satisfies Record<SocialProvider, { label: string; Icon: typeof GithubIcon }>

export function SocialSignInButton({
  provider,
  pending,
  disabled,
  onSignIn,
}: {
  provider: SocialProvider
  pending: boolean
  disabled: boolean
  onSignIn: () => void
}) {
  const { label, Icon } = PROVIDERS[provider]

  return (
    <Button
      variant="outline"
      aria-busy={pending}
      disabled={disabled}
      onClick={onSignIn}
      className="focus-visible:ring-white/40 h-11 w-full gap-2.5 border-white/30 bg-transparent text-sm font-medium text-white hover:bg-white/10 hover:text-white focus-visible:border-white"
    >
      {pending ? <Spinner /> : <Icon className="size-4" />}
      {label}
    </Button>
  )
}
