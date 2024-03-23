import { relations } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { userSchema } from "./user.schema";

export const habitSchema = sqliteTable("habits", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  color: text("color").notNull(),
  userId: text("user_id").notNull(),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const habitHistorySchema = sqliteTable("habits_history", {
    date: text("date").notNull(),
    habitId: text("habit_id").notNull().references(() => habitSchema.id),
});

export const habitUserRelations = relations(habitSchema, ({ one }) => ({
  user: one(userSchema, {
    fields: [habitSchema.userId],
    references: [userSchema.id]
  }),
}));

export type Habit = typeof habitSchema.$inferSelect;
export type InsertHabit = typeof habitSchema.$inferInsert;