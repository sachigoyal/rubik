import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./init";
import { z } from "zod";
import { todos, eq, not } from "@repo/db";

export const appRouter = router({
  hello: publicProcedure.query(() => "Hello from tRPC!"),
  todos: router({
    list: publicProcedure.query(
      async ({ ctx }) => await ctx.db.select().from(todos).orderBy(todos.id),
    ),
    add: publicProcedure
      .input(z.object({ text: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        const [todo] = await ctx.db.insert(todos).values(input).returning();
        return todo;
      }),
    toggle: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const [todo] = await ctx.db
          .update(todos)
          .set({ done: not(todos.done) })
          .where(eq(todos.id, input.id))
          .returning();
        if (!todo)
          throw new TRPCError({ code: "NOT_FOUND", message: "Todo not found" });
        return todo;
      }),
    remove: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const [todo] = await ctx.db
          .delete(todos)
          .where(eq(todos.id, input.id))
          .returning();
        if (!todo)
          throw new TRPCError({ code: "NOT_FOUND", message: "Todo not found" });
        return todo;
      }),
  }),
});

export type AppRouter = typeof appRouter;
