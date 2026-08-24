import { Trash2Icon } from "lucide-react"
import { motion } from "motion/react"
import { Button } from "@repo/ui/components/button"
import { Checkbox } from "@repo/ui/components/checkbox"
import { cn } from "@repo/ui/lib/utils"
import { useToggleTodo } from "@/hooks/mutations/use-toggle-todo"
import { useRemoveTodo } from "@/hooks/mutations/use-remove-todo"
import type { Todo } from "@/hooks/queries/use-todos"

export function TodoItem({ todo }: { todo: Todo }) {
  const toggleTodo = useToggleTodo()
  const removeTodo = useRemoveTodo()
  const unconfirmed = todo.id < 0

  return (
    <motion.li
      initial={false}
      exit={
        unconfirmed
          ? { height: 0, transition: { duration: 0 } }
          : {
              height: 0,
              paddingTop: 0,
              paddingBottom: 0,
              transition: { duration: 0.2, ease: "easeOut" },
            }
      }
      className={cn(
        "group flex items-center gap-3 overflow-hidden px-3 py-2.5",
        unconfirmed && "opacity-60",
      )}
    >
      <Checkbox
        checked={todo.done}
        disabled={unconfirmed}
        aria-label={todo.done ? "Mark as not done" : "Mark as done"}
        onCheckedChange={() => toggleTodo.mutate({ id: todo.id })}
      />
      <span className="min-w-0 flex-1 text-sm">
        <span
          className={cn(
            "relative transition-colors duration-300",
            "after:absolute after:top-[55%] after:right-0 after:left-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out motion-reduce:after:transition-none",
            todo.done && "text-muted-foreground after:scale-x-100",
          )}
        >
          {todo.text}
        </span>
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Delete "${todo.text}"`}
        disabled={unconfirmed}
        className="text-muted-foreground hover:text-destructive opacity-60 transition-opacity group-hover:opacity-100"
        onClick={() => removeTodo.mutate({ id: todo.id })}
      >
        <Trash2Icon />
      </Button>
    </motion.li>
  )
}
