import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { useTRPC } from "./lib/trpc"
import { useState } from "react"
import { Checkbox } from "@repo/ui/components/checkbox"
import { Loader2Icon, Trash2Icon } from "lucide-react"

function App() {
  const trpc = useTRPC()
  const [text, setText] = useState("")
  const queryClient = useQueryClient()
  const invalidateTodos = () => {
    queryClient.invalidateQueries({ queryKey: trpc.todos.list.queryKey() })
  }
  const todos = useQuery(trpc.todos.list.queryOptions())
  const add = useMutation(
    trpc.todos.add.mutationOptions({
      onSuccess: invalidateTodos,
    }),
  )
  const toggle = useMutation(
    trpc.todos.toggle.mutationOptions({
      onSuccess: invalidateTodos,
    }),
  )

  const remove = useMutation(
    trpc.todos.remove.mutationOptions({
      onSuccess: invalidateTodos,
    }),
  )

  return (
    <div className="mx-auto max-w-md p-8 min-h-svh flex flex-col gap-4 items-center justify-center">
      {/* {todos.isLoading && <p className="text-muted-foreground">Loading...</p>}
      {todos.data && <p className="text-muted-foreground">{todos.data.map((todo) => todo.text + " " + todo.id + " " + todo.done).join(", ")}</p>}
      <Button onClick={() => todos.refetch()}>Click me</Button> */}
      <h1 className="text-2xl font-bold">Todos</h1>
      <form
        className="flex gap-2 w-full"
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
        <Button type="submit" className="rounded-sm cursor-pointer">
          Add
        </Button>
      </form>
      {todos.isLoading && (
        <p className="text-muted-foreground flex items-center justify-center">
          <Loader2Icon className="w-4 h-4 animate-spin" />
          <span className="ml-2">Loading</span>
        </p>
      )}

      <ul className="grid grid-cols-[auto_1fr_auto_auto] w-full">
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
                className="hover:text-destructive/100 hover:bg-transparent p-0 m-0 cursor-pointer text-muted-foreground"
                onClick={() => remove.mutate({ id: todo.id })}
              >
                <Trash2Icon className="w-4 h-4" />
              </Button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
