import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    text: text().notNull(),
    done: boolean().notNull().default(false),
  });