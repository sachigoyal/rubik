import { TRPCError } from "@trpc/server"
import { and, eq, not, todos } from "@repo/db"
import { z } from "zod"
import { protectedProcedure, router } from "../init"

export const todoRouter = router({
  list: protectedProcedure.query(
    async ({ ctx }) =>
      await ctx.db
        .select()
        .from(todos)
        .where(eq(todos.userId, ctx.user.id))
        .orderBy(todos.id),
  ),
  add: protectedProcedure
    .input(z.object({ text: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const [todo] = await ctx.db
        .insert(todos)
        .values({ text: input.text, userId: ctx.user.id })
        .returning()
      return todo
    }),
  toggle: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const [todo] = await ctx.db
        .update(todos)
        .set({ done: not(todos.done) })
        .where(and(eq(todos.id, input.id), eq(todos.userId, ctx.user.id)))
        .returning()
      if (!todo)
        throw new TRPCError({ code: "NOT_FOUND", message: "Todo not found" })
      return todo
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const [todo] = await ctx.db
        .delete(todos)
        .where(and(eq(todos.id, input.id), eq(todos.userId, ctx.user.id)))
        .returning()
      if (!todo)
        throw new TRPCError({ code: "NOT_FOUND", message: "Todo not found" })
      return todo
    }),
})
