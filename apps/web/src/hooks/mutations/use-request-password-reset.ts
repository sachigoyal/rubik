import { useMutation } from "@tanstack/react-query"
import { authClient, unwrap } from "@/lib/auth"

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: async (email: string) => {
      unwrap(
        await authClient.requestPasswordReset({
          email,
          redirectTo: `${window.location.origin}/reset-password`,
        }),
        "Could not send the reset link.",
      )
      return email
    },
  })
}
