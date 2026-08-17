import { useSocialSignIn } from "@/hooks/mutations/use-social-sign-in"
import type { SocialProvider } from "@/lib/auth"
import { FormError } from "./form-error"
import { SocialSignInButton } from "./social-sign-in-button"

const PROVIDERS: readonly SocialProvider[] = ["github", "google"]

export function SocialSignIn() {
  const signIn = useSocialSignIn()

  return (
    <div className="flex flex-col gap-2.5">
      <div className="grid grid-cols-2 gap-2.5">
        {PROVIDERS.map((provider) => (
          <SocialSignInButton
            key={provider}
            provider={provider}
            pending={signIn.isPending && signIn.variables === provider}
            disabled={signIn.isPending}
            onSignIn={() => signIn.mutate(provider)}
          />
        ))}
      </div>
      <FormError message={signIn.error?.message} />
    </div>
  )
}
