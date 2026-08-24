import { useMutationState } from "@tanstack/react-query"
import { useTRPC } from "@/lib/trpc"

export function useTodoListError() {
  const trpc = useTRPC()
  const toggles = useMutationState({
    filters: { mutationKey: trpc.todos.toggle.mutationKey() },
  })
  const removes = useMutationState({
    filters: { mutationKey: trpc.todos.remove.mutationKey() },
  })

  let latestError: { at: number; message: string } | undefined
  let latestSuccessAt = 0
  for (const mutation of [...toggles, ...removes]) {
    if (mutation.status === "error" && mutation.error) {
      if (!latestError || mutation.submittedAt > latestError.at) {
        latestError = {
          at: mutation.submittedAt,
          message: mutation.error.message,
        }
      }
    }
    if (mutation.status === "success") {
      latestSuccessAt = Math.max(latestSuccessAt, mutation.submittedAt)
    }
  }

  if (!latestError || latestSuccessAt > latestError.at) return undefined
  return latestError.message
}
