import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/lib/trpc"
import { useInvalidateTodos, type Todo } from "@/hooks/queries/use-todos"

export function useAddTodo() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const invalidateTodos = useInvalidateTodos()
  const queryKey = trpc.todos.list.queryKey()

  return useMutation(
    trpc.todos.add.mutationOptions({
      onMutate: async ({ text }) => {
        await queryClient.cancelQueries({ queryKey })
        const previous = queryClient.getQueryData(queryKey)
        const optimistic: Todo = {
          id: -Date.now(),
          text,
          done: false,
          userId: "",
        }
        queryClient.setQueryData(queryKey, (todos = []) => [
          ...todos,
          optimistic,
        ])
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
