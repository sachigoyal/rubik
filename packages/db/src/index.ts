import { drizzle } from "drizzle-orm/neon-http";

export function createDB(databaseUrl: string) {
  return drizzle(databaseUrl);
}

export * from "./schema";
export { eq, and, not } from "drizzle-orm";
