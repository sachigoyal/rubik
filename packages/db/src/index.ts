import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

export function createDB(databaseUrl: string) {
  return drizzle(databaseUrl, { schema })
}

export * from "./schema"
export { eq, and, not } from "drizzle-orm"
