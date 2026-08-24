import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useTRPC, type RouterOutputs } from "@/lib/trpc"

export type Todo = RouterOutputs["todos"]["list"][number]

export function useTodos() {
  const trpc = useTRPC()
  return useQuery(trpc.todos.list.queryOptions())
}

export function useInvalidateTodos() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  return () =>
    queryClient.invalidateQueries({ queryKey: trpc.todos.list.queryKey() })
}
