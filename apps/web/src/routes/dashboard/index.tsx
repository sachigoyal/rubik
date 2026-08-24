import { createFileRoute } from "@tanstack/react-router"
import { TodoComposer } from "@/components/todos/todo-composer"
import { TodoList } from "@/components/todos/todo-list"
import { pageHead } from "@/lib/site"

export const Route = createFileRoute("/dashboard/")({
  head: () => pageHead({ title: "Tasks", path: "/dashboard", noIndex: true }),
  component: TasksPage,
})

function TasksPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <h1 className="text-xl font-semibold tracking-tight">Tasks</h1>
      <TodoComposer />
      <TodoList />
    </div>
  )
}
