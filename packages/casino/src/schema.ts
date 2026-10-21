import { sql } from "drizzle-orm"
import {
  pgTable,
  text,
  timestamp,
  integer,
  decimal,
  uuid,
  jsonb,
  boolean,
  bigint,
  uniqueIndex,
  index,
  check,
} from "drizzle-orm/pg-core"

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(), // maps to neon_auth user id
  name: text("name"),
  email: text("email").notNull(),
  balance: decimal("balance", { precision: 12, scale: 2 })
    .default("1000.00")
    .notNull(), // starting balance
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
})

export const games = pgTable(
  "games",
  {
    slug: text("slug").primaryKey(), // e.g. "dice", "crash", "plinko"
    name: text("name").notNull(),
    description: text("description"),
    categoryId: text("category_id").references(() => categories.id),
    imageKey: text("image_key"), // Neon Object Storage key for the thumbnail
    status: text("status").default("draft").notNull(),
    visible: boolean("visible").default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    minBetCents: bigint("min_bet_cents", { mode: "number" })
      .default(100)
      .notNull(),
    maxBetCents: bigint("max_bet_cents", { mode: "number" })
      .default(100000)
      .notNull(),
    maxPayoutCents: bigint("max_payout_cents", { mode: "number" })
      .default(100000000)
      .notNull(),
    configVersion: integer("config_version").default(1).notNull(),
    isActive: integer("is_active").default(0).notNull(),
  },
  (t) => [
    check(
      "game_limits",
      sql`${t.minBetCents} > 0 AND ${t.maxBetCents} >= ${t.minBetCents} AND ${t.maxPayoutCents} >= ${t.maxBetCents}`
    ),
    check(
      "game_status",
      sql`${t.status} IN ('draft','enabled','paused','maintenance','retired')`
    ),
  ]
)

export const bets = pgTable("bets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "restrict" }),
  gameSlug: text("game_slug")
    .notNull()
    .references(() => games.slug, { onDelete: "restrict" }),
  betAmount: decimal("bet_amount", { precision: 12, scale: 2 }).notNull(),
  payoutAmount: decimal("payout_amount", { precision: 12, scale: 2 }).notNull(),
  multiplier: decimal("multiplier", { precision: 18, scale: 8 }).notNull(),
  result: text("result").notNull(), // "win" or "lose"
  gameData: jsonb("game_data"), // store specific details (e.g. dice roll target and result)
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "restrict" }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  type: text("type").notNull(), // 'deposit' | 'withdrawal'
  status: text("status").notNull().default("pending"), // 'pending' | 'completed' | 'failed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const support_tickets = pgTable("support_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "restrict" }),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("open"), // 'open' | 'closed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const casinoSettings = pgTable("casino_settings", {
  id: integer("id").primaryKey(),
  bettingPaused: boolean("betting_paused").default(false).notNull(),
})
export const casinoAdmins = pgTable("casino_admins", {
  userId: text("user_id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})
export const gameRounds = pgTable(
  "game_rounds",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "restrict" }),
    gameSlug: text("game_slug")
      .notNull()
      .references(() => games.slug, { onDelete: "restrict" }),
    requestId: text("request_id").notNull(),
    fingerprint: text("fingerprint").notNull(),
    stakeCents: bigint("stake_cents", { mode: "number" }).notNull(),
    maxPayoutCents: bigint("max_payout_cents", { mode: "number" }).notNull(),
    configVersion: integer("config_version").notNull(),
    engineVersion: integer("engine_version").default(1).notNull(),
    state: jsonb("state").notNull(),
    publicResult: jsonb("public_result").default({}).notNull(),
    status: text("status").default("active").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    settledAt: timestamp("settled_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("round_request_unique").on(t.userId, t.requestId),
    uniqueIndex("one_active_session")
      .on(t.userId, t.gameSlug)
      .where(
        sql`${t.status} = 'active' AND ${t.gameSlug} IN ('mines','crash')`
      ),
    check("round_stake_positive", sql`${t.stakeCents} > 0`),
    check("round_status", sql`${t.status} IN ('active','settled')`),
  ]
)
export const walletEntries = pgTable(
  "wallet_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "restrict" }),
    roundId: uuid("round_id")
      .notNull()
      .references(() => gameRounds.id, { onDelete: "restrict" }),
    kind: text("kind").notNull(),
    amountCents: bigint("amount_cents", { mode: "number" }).notNull(),
    balanceAfter: decimal("balance_after", {
      precision: 12,
      scale: 2,
    }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("wallet_round_kind_unique").on(t.roundId, t.kind),
    check("wallet_kind", sql`${t.kind} IN ('stake','payout')`),
  ]
)
export const gameConfigVersions = pgTable(
  "game_config_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gameSlug: text("game_slug")
      .notNull()
      .references(() => games.slug, { onDelete: "restrict" }),
    version: integer("version").notNull(),
    config: jsonb("config").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [uniqueIndex("game_config_unique").on(t.gameSlug, t.version)]
)
export const userGameRestrictions = pgTable(
  "user_game_restrictions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "restrict" }),
    gameSlug: text("game_slug").references(() => games.slug, {
      onDelete: "restrict",
    }),
    reason: text("reason").notNull(),
    createdBy: text("created_by").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("restrictions_user_idx").on(t.userId)]
)
export const adminAuditLogs = pgTable("admin_audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: text("actor_id").notNull(),
  command: jsonb("command").notNull(),
  beforeData: jsonb("before_data"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const gameEvents = pgTable(
  "game_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roundId: uuid("round_id")
      .notNull()
      .references(() => gameRounds.id, { onDelete: "restrict" }),
    kind: text("kind").notNull(),
    data: jsonb("data").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("events_round_idx").on(t.roundId)]
)
