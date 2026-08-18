import { Hono } from "hono";
import { cors } from "hono/cors";
import { trpcServer } from "@hono/trpc-server";
import { createDB } from "@repo/db";
import { appRouter } from "./trpc/router";

type Env = {
  DATABASE_URL: string;
}

const app = new Hono<{Bindings: Env}>();

app.use("*", cors());

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opt, c) => ({
      db: createDB(c.env.DATABASE_URL)
    }),
  }),
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
