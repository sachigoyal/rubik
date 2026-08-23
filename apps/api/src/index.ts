import { Hono } from "hono"
import { cors } from "hono/cors"
import { trpcServer } from "@hono/trpc-server"
import { createDB } from "@repo/db"
import { appRouter } from "./trpc/router"
import { createAuth } from "./auth"

export type Env = {
  DATABASE_URL: string
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
}

const app = new Hono<{ Bindings: Env }>()

app.use("*", cors({ origin: "http://localhost:5173", credentials: true }))

app.all("/api/auth/*", (c) => createAuth(c.env).handler(c.req.raw))

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: async (_opt, c) => {
      const session = await createAuth(c.env).api.getSession({
        headers: c.req.raw.headers,
      })
      return {
        db: createDB(c.env.DATABASE_URL),
        user: session?.user ?? null,
      }
    },
  }),
)

export default app
