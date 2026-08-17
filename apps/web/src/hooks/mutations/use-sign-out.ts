import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { authClient } from "@/lib/auth"

export function useSignOut() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut()
      if (error) throw new Error(error.message ?? "Could not sign out.")
    },
    onSuccess: async () => {
      queryClient.clear()
      await navigate({ to: "/sign-in" })
    },
  })
}
