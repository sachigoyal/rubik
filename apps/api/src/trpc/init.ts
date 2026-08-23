import { initTRPC, TRPCError } from "@trpc/server"
import type { createDB } from "@repo/db"
import type { User } from "better-auth"
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
type Context = {
  db: ReturnType<typeof createDB>
  user: User | null
}
const t = initTRPC.context<Context>().create()
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" })
  return next({ ctx: { ...ctx, user: ctx.user } })
})
