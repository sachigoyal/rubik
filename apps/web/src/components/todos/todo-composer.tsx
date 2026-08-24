import { useState, type FormEvent } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { useAddTodo } from "@/hooks/mutations/use-add-todo"

export function TodoComposer() {
  const [text, setText] = useState("")
  const addTodo = useAddTodo()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    addTodo.mutate(
      { text: trimmed },
      { onError: () => setText((current) => current || trimmed) },
    )
    setText("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="What needs doing?"
          className="h-9"
          autoFocus
        />
        <Button type="submit" size="lg" disabled={!text.trim()}>
          <PlusIcon />
          Add
        </Button>
      </div>
      {addTodo.error && (
        <p role="alert" className="text-destructive text-xs">
          {addTodo.error.message}
        </p>
      )}
    </form>
  )
}
