import { CircleAlertIcon, InboxIcon } from "lucide-react"
import { AnimatePresence, MotionConfig } from "motion/react"
import { EmptyState } from "@/components/common/empty-state"
import { useTodos } from "@/hooks/queries/use-todos"
import { useTodoListError } from "@/hooks/mutations/use-todo-list-error"
import { TodoItem } from "./todo-item"

export function TodoList() {
  const { data: todos, isLoading, error } = useTodos()
  const mutationError = useTodoListError()

  if (isLoading) return <TodoListSkeleton />

  if (error)
    return (
      <EmptyState
        icon={CircleAlertIcon}
        title="Couldn't load your tasks"
        description={error.message}
      />
    )

  if (!todos?.length)
    return (
      <EmptyState
        icon={InboxIcon}
        title="Nothing here yet"
        description="Add your first task above."
      />
    )

  return (
    <div className="flex flex-col gap-1.5">
      {mutationError && (
        <p role="alert" className="text-destructive text-xs">
          {mutationError}
        </p>
      )}
      <MotionConfig reducedMotion="user">
        <ul className="divide-y rounded-xl border">
          <AnimatePresence initial={false}>
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </AnimatePresence>
        </ul>
      </MotionConfig>
    </div>
  )
}

function TodoListSkeleton() {
  return (
    <ul className="divide-y rounded-xl border" aria-busy>
      {[0, 1, 2].map((row) => (
        <li key={row} className="flex items-center gap-3 px-3 py-2.5">
          <div className="bg-muted size-4 shrink-0 animate-pulse rounded-[4px]" />
          <div
            className="bg-muted h-4 animate-pulse rounded"
            style={{ width: `${60 - row * 15}%` }}
          />
        </li>
      ))}
    </ul>
  )
}
