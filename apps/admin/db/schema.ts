import { pgTable, text, timestamp, integer, decimal, uuid, jsonb } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(), // maps to neon_auth user id
  name: text("name"),
  email: text("email").notNull(),
  balance: decimal("balance", { precision: 12, scale: 2 }).default("1000.00").notNull(), // starting balance
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const games = pgTable("games", {
  slug: text("slug").primaryKey(), // e.g. "dice", "crash", "plinko"
  name: text("name").notNull(),
  description: text("description"),
  categoryId: text("category_id").references(() => categories.id),
  imageKey: text("image_key"), // Neon Object Storage key for the thumbnail
  isActive: integer("is_active").default(1).notNull(), // 1 for active, 0 for inactive
});

export const bets = pgTable("bets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  gameSlug: text("game_slug").notNull().references(() => games.slug, { onDelete: "cascade" }),
  betAmount: decimal("bet_amount", { precision: 12, scale: 2 }).notNull(),
  payoutAmount: decimal("payout_amount", { precision: 12, scale: 2 }).notNull(),
  multiplier: decimal("multiplier", { precision: 10, scale: 4 }).notNull(),
  result: text("result").notNull(), // "win" or "lose"
  gameData: jsonb("game_data"), // store specific details (e.g. dice roll target and result)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  type: text("type").notNull(), // 'deposit' | 'withdrawal'
  status: text("status").notNull().default("pending"), // 'pending' | 'completed' | 'failed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const support_tickets = pgTable("support_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("open"), // 'open' | 'closed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
