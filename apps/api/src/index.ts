import { Hono } from "hono"
import { cors } from "hono/cors"
import { trpcServer } from "@hono/trpc-server"
import { createDB } from "@repo/db"
import { appRouter } from "./trpc/router"
import { createAuth } from "./auth"

const app = new Hono<{ Bindings: Env }>()

app.use("*", (c, next) =>
  cors({ origin: c.env.APP_URL, credentials: true })(c, next),
)

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
