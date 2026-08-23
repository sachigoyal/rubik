import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Checkbox } from "@repo/ui/components/checkbox"
import { Loader2Icon, Trash2Icon } from "lucide-react"
import { authClient } from "@/lib/auth"
import { useTRPC } from "@/lib/trpc"

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const { data } = await authClient.getSession()
    if (!data) throw redirect({ to: "/login" })
  },
  component: Todos,
})

function Todos() {
  const trpc = useTRPC()
  const navigate = useNavigate()
  const [text, setText] = useState("")
  const queryClient = useQueryClient()

  const invalidateTodos = () => {
    queryClient.invalidateQueries({ queryKey: trpc.todos.list.queryKey() })
  }

  const todos = useQuery(trpc.todos.list.queryOptions())
  const add = useMutation(
    trpc.todos.add.mutationOptions({ onSuccess: invalidateTodos }),
  )
  const toggle = useMutation(
    trpc.todos.toggle.mutationOptions({ onSuccess: invalidateTodos }),
  )
  const remove = useMutation(
    trpc.todos.remove.mutationOptions({ onSuccess: invalidateTodos }),
  )

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-4 p-8">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Todos</h1>
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={async () => {
            await authClient.signOut()
            navigate({ to: "/login" })
          }}
        >
          Sign out
        </Button>
      </div>

      <form
        className="flex w-full gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (!text.trim()) return
          add.mutate({ text })
          setText("")
        }}
      >
        <Input
          value={text}
          className="rounded-sm"
          onChange={(e) => setText(e.target.value)}
          placeholder="What do you need to do?"
        />
        <Button type="submit" className="cursor-pointer rounded-sm">
          Add
        </Button>
      </form>

      {todos.isLoading && (
        <p className="text-muted-foreground flex items-center justify-center">
          <Loader2Icon className="h-4 w-4 animate-spin" />
          <span className="ml-2">Loading</span>
        </p>
      )}

      <ul className="grid w-full grid-cols-[auto_1fr_auto_auto]">
        {todos.data?.map((todo) => (
          <li key={todo.id} className="contents">
            <span className="flex items-center justify-center border p-2">
              {todo.id}
            </span>
            <span className="flex items-center border p-2">{todo.text}</span>
            <span className="flex items-center justify-center border p-2">
              <Checkbox
                className="cursor-pointer"
                checked={todo.done}
                onCheckedChange={() => toggle.mutate({ id: todo.id })}
              />
            </span>
            <span className="flex items-center justify-center border p-2">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-destructive m-0 cursor-pointer p-0 hover:bg-transparent"
                onClick={() => remove.mutate({ id: todo.id })}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
