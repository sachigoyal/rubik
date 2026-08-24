import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/lib/trpc"
import { useInvalidateTodos } from "@/hooks/queries/use-todos"

export function useToggleTodo() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const invalidateTodos = useInvalidateTodos()
  const queryKey = trpc.todos.list.queryKey()

  return useMutation(
    trpc.todos.toggle.mutationOptions({
      onMutate: async ({ id }) => {
        await queryClient.cancelQueries({ queryKey })
        const previous = queryClient.getQueryData(queryKey)
        queryClient.setQueryData(queryKey, (todos) =>
          todos?.map((todo) =>
            todo.id === id ? { ...todo, done: !todo.done } : todo,
          ),
        )
        return { previous }
      },
      onError: (_error, _input, context) => {
        queryClient.setQueryData(queryKey, context?.previous)
      },
      onSettled: () => {
        if (queryClient.isMutating() === 1) return invalidateTodos()
      },
    }),
  )
}
