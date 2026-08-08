import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core"
import { user } from "./user"

export const todos = pgTable("todos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  text: text().notNull(),
  done: boolean().notNull().default(false),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})
