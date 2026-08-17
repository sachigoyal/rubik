import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { authClient, unwrap } from "@/lib/auth"

export type ResetPassword = { token: string; newPassword: string }

export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (input: ResetPassword) => {
      unwrap(await authClient.resetPassword(input), "Could not reset password.")
    },
    onSuccess: () => navigate({ to: "/sign-in" }),
  })
}
