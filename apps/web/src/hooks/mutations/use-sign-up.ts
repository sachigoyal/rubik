import { useMutation } from "@tanstack/react-query"
import { authClient, unwrap } from "@/lib/auth"

export type SignUp = { name: string; email: string; password: string }

export function useSignUp() {
  return useMutation({
    mutationFn: async (input: SignUp) => {
      unwrap(
        await authClient.signUp.email({
          ...input,
          callbackURL: `${window.location.origin}/dashboard`,
        }),
        "Could not create your account.",
      )
      return input.email
    },
  })
}
