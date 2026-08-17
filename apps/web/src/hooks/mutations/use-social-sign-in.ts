import { useMutation } from "@tanstack/react-query"
import { authClient, unwrap, type SocialProvider } from "@/lib/auth"

export function useSocialSignIn() {
  return useMutation({
    mutationFn: async (provider: SocialProvider) => {
      unwrap(
        await authClient.signIn.social({
          provider,
          callbackURL: `${window.location.origin}/dashboard`,
        }),
        "Could not sign in.",
      )
    },
  })
}
