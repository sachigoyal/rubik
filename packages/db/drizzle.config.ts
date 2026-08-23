import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({ path: new URL("../../apps/api/.dev.vars", import.meta.url).pathname })

const url = process.env.DATABASE_URL
if (!url) {
  throw new Error(
    "DATABASE_URL is not set. Add it to apps/api/.dev.vars or export it before running drizzle-kit.",
  )
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url },
})
