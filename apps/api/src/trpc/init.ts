import { initTRPC, TRPCError } from "@trpc/server"
import type { createDB } from "@repo/db"
import type { User } from "better-auth"
type Context = {
  db: ReturnType<typeof createDB>
  user: User | null
}
const t = initTRPC.context<Context>().create()
export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" })
  return next({ ctx: { ...ctx, user: ctx.user } })
})
