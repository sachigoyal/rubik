import { publicProcedure, router } from "./init"
import { todoRouter } from "./routers/todo"

export const appRouter = router({
  health: publicProcedure.query(() => "OK"),
  todos: todoRouter,
})

export type AppRouter = typeof appRouter
