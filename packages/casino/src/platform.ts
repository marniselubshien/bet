import "server-only"
import { isJourneyGame } from "./catalog"
import {
  newJourney,
  journeyView,
  journeyMultiplier,
  advanceJourney,
} from "./games/journey"
import { Pool, type PoolClient } from "pg"
import { createHash } from "node:crypto"
import {
  finite,
  instantOutcome,
  isEngine,
  mineLayout,
  minesMultiplier,
  payoutCents,
  random,
  stakeCents,
} from "./engines"

const runtime = globalThis as typeof globalThis & { casinoPool?: Pool }
const pool =
  runtime.casinoPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 10000,
  })
if (process.env.NODE_ENV !== "production") runtime.casinoPool = pool
export type ActionResult = {
  payout: number
  roundId?: string
  newBalance?: number
  success?: boolean
  multiplier?: number
  currentMultiplier?: number
  nextMultiplier?: number
  isWin?: boolean
  gameOver?: boolean
  isMine?: boolean
  isCashout?: boolean
  mineIndices?: number[]
  allMines?: number[]
  revealedIndices?: number[]
  [key: string]: unknown
}
type State = {
  mines: number[]
  revealed: number[]
  count: number
  crashPoint: number
  autoCashout: number
  startedAt: number
  traps: number[]
  choices: number[]
}
type Round = {
  id: string
  user_id: string
  game_slug: string
  stake_cents: string
  max_payout_cents: string
  state: State
  status: string
  public_result: ActionResult
}
export async function transaction<T>(fn: (c: PoolClient) => Promise<T>) {
  const c = await pool.connect()
  try {
    await c.query("BEGIN")
    const result = await fn(c)
    await c.query("COMMIT")
    return result
  } catch (error) {
    await c.query("ROLLBACK")
    throw error
  } finally {
    c.release()
  }
}
export async function catalog() {
  const { rows } = await pool.query(
    "SELECT games.*, casino_settings.betting_paused FROM games CROSS JOIN casino_settings WHERE casino_settings.id = 1 AND games.visible = true ORDER BY games.sort_order, games.name, games.slug"
  )
  return rows
}
export async function recentWins() {
  const { rows } = await pool.query(
    "SELECT bets.id, games.name, bets.payout_amount FROM bets JOIN games ON games.slug=bets.game_slug WHERE bets.result='win' ORDER BY bets.created_at DESC LIMIT 5"
  )
  return rows.map((row) => ({
    id: String(row.id),
    gameName: String(row.name),
    payout: Number(row.payout_amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    }),
    user: "Player",
    badgeBg: "from-emerald-700 to-green-900",
    badgeLabel: String(row.name).slice(0, 8),
    emoji: "◆",
  }))
}
export async function requireAdmin(userId: string) {
  const { rows } = await pool.query(
    "SELECT 1 FROM casino_admins WHERE user_id = $1",
    [userId]
  )
  if (!rows.length) throw new Error("Administrator access required")
}
async function access(c: PoolClient, userId: string, slug: string) {
  // Shared locks serialize admission against admin changes while allowing concurrent bettors.
  const {
    rows: [settings],
  } = await c.query("SELECT * FROM casino_settings WHERE id = 1 FOR SHARE")
  const {
    rows: [game],
  } = await c.query("SELECT * FROM games WHERE slug = $1 FOR SHARE", [slug])
  if (
    !settings ||
    settings.betting_paused ||
    !game ||
    !isEngine(slug) ||
    game.is_active !== 1 ||
    game.status !== "enabled"
  )
    throw new Error("This game is unavailable for new bets")
  await c.query("SELECT id FROM profiles WHERE id = $1 FOR UPDATE", [userId])
  const { rows } = await c.query(
    "SELECT 1 FROM user_game_restrictions WHERE user_id = $1 AND (game_slug IS NULL OR game_slug = $2) AND (expires_at IS NULL OR expires_at > now())",
    [userId, slug]
  )
  if (rows.length) throw new Error("Betting is restricted for your account")
  return game
}
async function money(
  c: PoolClient,
  userId: string,
  roundId: string,
  cents: number,
  kind: string
) {
  const {
    rows: [profile],
  } = await c.query(
    "UPDATE profiles SET balance = balance + $2::numeric / 100 WHERE id = $1 AND balance + $2::numeric / 100 >= 0 RETURNING balance",
    [userId, cents]
  )
  if (!profile) throw new Error("Insufficient balance")
  await c.query(
    "INSERT INTO wallet_entries(user_id, round_id, kind, amount_cents, balance_after) VALUES ($1,$2,$3,$4,$5)",
    [userId, roundId, kind, cents, profile.balance]
  )
  return Number(profile.balance)
}
async function settle(
  c: PoolClient,
  round: Round,
  multiplier: number,
  data: Record<string, unknown>
): Promise<ActionResult> {
  const payout = payoutCents(
    Number(round.stake_cents),
    multiplier,
    Number(round.max_payout_cents)
  )
  const newBalance = await money(c, round.user_id, round.id, payout, "payout")
  const result = {
    ...data,
    multiplier,
    payout: payout / 100,
    newBalance,
    success: true,
    roundId: round.id,
  }
  await c.query(
    "UPDATE game_rounds SET status = 'settled', public_result = $2, settled_at = now() WHERE id = $1",
    [round.id, JSON.stringify(result)]
  )
  await c.query(
    "INSERT INTO bets(user_id, game_slug, bet_amount, payout_amount, multiplier, result, game_data) VALUES ($1,$2,$3,$4,$5,$6,$7)",
    [
      round.user_id,
      round.game_slug,
      Number(round.stake_cents) / 100,
      payout / 100,
      multiplier,
      data.refunded
        ? "refund"
        : payout > Number(round.stake_cents)
          ? "win"
          : "lose",
      JSON.stringify({ ...data, roundId: round.id, engineVersion: 1 }),
    ]
  )
  await c.query(
    "INSERT INTO game_events(round_id,kind,data) VALUES ($1,$2,$3)",
    [round.id, "settled", JSON.stringify(result)]
  )
  return result
}
export async function startRound(
  userId: string,
  slug: string,
  input: Record<string, unknown>,
  requestId: string
) {
  if (typeof requestId !== "string" || !/^[\w-]{16,100}$/.test(requestId))
    throw new Error("Invalid request ID")
  const stake = stakeCents(input.betAmount)
  const fingerprint = createHash("sha256")
    .update(JSON.stringify({ slug, input }))
    .digest("hex")
  return transaction(async (c) => {
    await c.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [
      userId + ":" + requestId,
    ])
    const {
      rows: [previous],
    } = await c.query(
      "SELECT * FROM game_rounds WHERE user_id = $1 AND request_id = $2",
      [userId, requestId]
    )
    if (previous) {
      if (previous.fingerprint !== fingerprint)
        throw new Error("Request ID already used")
      return previous.public_result
    }
    const game = await access(c, userId, slug)
    if (
      stake < Number(game.min_bet_cents) ||
      stake > Number(game.max_bet_cents)
    )
      throw new Error("Bet is outside game limits")
    const max = Number(game.max_payout_cents)
    if (slug === "mines" || slug === "crash" || isJourneyGame(slug)) {
      const active = await c.query(
        "SELECT id FROM game_rounds WHERE user_id=$1 AND game_slug=$2 AND status='active'",
        [userId, slug]
      )
      if (active.rows.length)
        throw new Error("Resume your existing round before starting another")
    }
    let state = {}
    if (isJourneyGame(slug)) {
      payoutCents(stake, journeyMultiplier(8), max)
      state = newJourney()
    } else if (slug === "mines") {
      const count = finite(input.minesCount, 1, 24, "mines count")
      payoutCents(stake, minesMultiplier(count, 25 - count), max)
      state = { count, mines: mineLayout(count), revealed: [] }
    } else if (slug === "crash") {
      const autoCashout = finite(
        input.autoCashout,
        1.01,
        1000000,
        "auto cashout"
      )
      payoutCents(stake, autoCashout, max)
      state = {
        autoCashout,
        crashPoint: Math.max(
          1,
          Math.min(1000000, Math.floor((0.99 / (1 - random())) * 100) / 100)
        ),
        startedAt: Date.now(),
      }
    }
    const outcome =
      slug !== "mines" && slug !== "crash" && !isJourneyGame(slug)
        ? instantOutcome(slug, input)
        : null
    if (outcome) payoutCents(stake, outcome.multiplier, max)
    const {
      rows: [round],
    } = await c.query(
      "INSERT INTO game_rounds(user_id,game_slug,request_id,fingerprint,stake_cents,max_payout_cents,state,config_version) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
      [
        userId,
        slug,
        requestId,
        fingerprint,
        stake,
        max,
        JSON.stringify(state),
        game.config_version,
      ]
    )
    const newBalance = await money(c, userId, round.id, -stake, "stake")
    await c.query(
      "INSERT INTO game_events(round_id,kind,data) VALUES ($1,$2,$3)",
      [
        round.id,
        "started",
        JSON.stringify({
          stakeCents: stake,
          configVersion: game.config_version,
          engineVersion: 1,
        }),
      ]
    )
    if (outcome)
      return settle(c, round, outcome.isWin ? outcome.multiplier : 0, {
        ...outcome,
        profit:
          ((outcome.isWin ? payoutCents(stake, outcome.multiplier, max) : 0) -
            stake) /
          100,
      })
    const result = {
      betAmount: stake / 100,
      autoCashout: input.autoCashout,
      started: true,
      roundId: round.id,
      newBalance,
      currentMultiplier: 1,
      nextMultiplier:
        slug === "mines" ? minesMultiplier(Number(input.minesCount), 1) : 1,
      minesCount: input.minesCount,
      revealedIndices: [],
      startedAt: Date.now(),
      ...(isJourneyGame(slug)
        ? journeyView(state as ReturnType<typeof newJourney>)
        : {}),
    }
    await c.query("UPDATE game_rounds SET public_result = $2 WHERE id = $1", [
      round.id,
      JSON.stringify(result),
    ])
    return result
  })
}
export async function activeRound(userId: string, slug: string) {
  const {
    rows: [round],
  } = await pool.query(
    "SELECT * FROM game_rounds WHERE user_id = $1 AND game_slug = $2 AND status = 'active'",
    [userId, slug]
  )
  if (!round) return null
  return {
    ...round.public_result,
    roundId: round.id,
    revealedIndices: round.state.revealed || [],
    currentMultiplier:
      slug === "mines"
        ? minesMultiplier(round.state.count, round.state.revealed.length)
        : 1,
    nextMultiplier:
      slug === "mines"
        ? minesMultiplier(round.state.count, round.state.revealed.length + 1)
        : 1,
    ...(isJourneyGame(slug) ? journeyView(round.state) : {}),
  }
}
export async function actOnRound(
  userId: string,
  slug: string,
  roundId: string,
  action: "reveal" | "cashout" | "poll",
  tile?: number
): Promise<ActionResult> {
  return transaction(async (c) => {
    const {
      rows: [round],
    }: { rows: Round[] } = await c.query(
      "SELECT * FROM game_rounds WHERE id = $1 AND user_id = $2 AND game_slug = $3 FOR UPDATE",
      [roundId, userId, slug]
    )
    if (!round) throw new Error("Round not found")
    if (round.status === "settled") return round.public_result
    if (isJourneyGame(slug)) {
      const s = round.state
      const view = journeyView(s)
      if (action === "poll") return { ...view, payout: 0, gameOver: false }
      if (action === "cashout") {
        if (!s.choices.length)
          throw new Error("Complete at least one step before cashing out")
        return settle(c, round, journeyMultiplier(s.choices.length), {
          ...view,
          isWin: true,
          gameOver: true,
        })
      }
      if (action !== "reveal") throw new Error("Invalid action")
      const next = advanceJourney(s, tile)
      if (next.replayed) return { ...view, payout: 0, gameOver: false }
      const nextView = journeyView(next.state)
      if (next.lost)
        return settle(c, round, 0, {
          ...nextView,
          isWin: false,
          gameOver: true,
          failedStep: s.choices.length,
        })
      if (next.state.choices.length === 8)
        return settle(c, round, journeyMultiplier(8), {
          ...nextView,
          isWin: true,
          gameOver: true,
        })
      const publicResult = {
        ...round.public_result,
        ...nextView,
        payout: 0,
        gameOver: false,
      }
      await c.query(
        "UPDATE game_rounds SET state=$2,public_result=$3 WHERE id=$1",
        [round.id, JSON.stringify(next.state), JSON.stringify(publicResult)]
      )
      await c.query(
        "INSERT INTO game_events(round_id,kind,data) VALUES ($1,$2,$3)",
        [
          round.id,
          "advanced",
          JSON.stringify({ tile, step: next.state.choices.length }),
        ]
      )
      return publicResult
    }
    if (slug === "crash") {
      const s = round.state
      const live =
        Math.floor(
          (1 +
            Math.pow(
              (Math.max(0, Date.now() - s.startedAt) / 1000) * 0.55,
              1.8
            )) *
            100
        ) / 100
      const autoWon = s.autoCashout < s.crashPoint && live >= s.autoCashout
      const crashed = live >= s.crashPoint
      if (autoWon || crashed || action === "cashout") {
        const multiplier = autoWon ? s.autoCashout : crashed ? 0 : live
        return settle(c, round, multiplier, {
          isWin: multiplier > 0,
          gameOver: true,
          crashPoint: s.crashPoint,
          currentMultiplier: multiplier || s.crashPoint,
        })
      }
      return { gameOver: false, currentMultiplier: live, payout: 0 }
    }
    if (slug !== "mines") throw new Error("Unsupported round")
    const s = round.state
    if (action === "reveal") {
      finite(tile, 0, 24, "tile")
      if (!Number.isInteger(tile)) throw new Error("Invalid tile")
      if (s.revealed.includes(tile!))
        return {
          isMine: false,
          gameOver: false,
          revealedIndices: s.revealed,
          currentMultiplier: minesMultiplier(s.count, s.revealed.length),
          nextMultiplier: minesMultiplier(s.count, s.revealed.length + 1),
          payout: 0,
        }
      if (s.mines.includes(tile!))
        return settle(c, round, 0, {
          isMine: true,
          gameOver: true,
          mineIndices: s.mines,
        })
      s.revealed.push(tile!)
      await c.query(
        "INSERT INTO game_events(round_id,kind,data) VALUES ($1,$2,$3)",
        [
          round.id,
          "revealed",
          JSON.stringify({ tile, revealedCount: s.revealed.length }),
        ]
      )
      await c.query("UPDATE game_rounds SET state = $2 WHERE id = $1", [
        round.id,
        JSON.stringify(s),
      ])
    } else if (action !== "cashout") throw new Error("Invalid action")
    if (!s.revealed.length) throw new Error("Reveal at least one tile")
    const multiplier = minesMultiplier(s.count, s.revealed.length)
    if (action === "cashout" || s.revealed.length === 25 - s.count)
      return settle(c, round, multiplier, {
        isMine: false,
        isWin: true,
        gameOver: true,
        isCashout: true,
        mineIndices: s.mines,
        allMines: s.mines,
        revealedIndices: s.revealed,
        currentMultiplier: multiplier,
      })
    return {
      isMine: false,
      gameOver: false,
      revealedIndices: s.revealed,
      currentMultiplier: multiplier,
      nextMultiplier: minesMultiplier(s.count, s.revealed.length + 1),
      payout: 0,
    }
  })
}
export async function adminSnapshot(userId: string) {
  await requireAdmin(userId)
  const [games, settings, restrictions, audits, categories, rounds] =
    await Promise.all([
      pool.query("SELECT * FROM games ORDER BY sort_order, name, slug"),
      pool.query("SELECT * FROM casino_settings WHERE id = 1"),
      pool.query(
        "SELECT * FROM user_game_restrictions ORDER BY created_at DESC LIMIT 100"
      ),
      pool.query(
        "SELECT * FROM admin_audit_logs ORDER BY created_at DESC LIMIT 50"
      ),
      pool.query("SELECT * FROM categories ORDER BY name"),
      pool.query(
        "SELECT id,user_id,game_slug,stake_cents,status,created_at,config_version FROM game_rounds ORDER BY (status = 'active') DESC, created_at DESC LIMIT 100"
      ),
    ])
  return {
    games: games.rows,
    settings: settings.rows[0],
    restrictions: restrictions.rows,
    audits: audits.rows,
    categories: categories.rows,
    rounds: rounds.rows,
  }
}
export async function adminCommand(
  userId: string,
  command: {
    kind: string
    slug?: string
    status?: string
    visible?: boolean
    min?: number
    max?: number
    payout?: number
    target?: string
    name?: string
    description?: string
    image?: string
    priorities?: { slug: string; priority: number }[]
    sortOrder?: number
    categoryId?: string
    reason: string
    id?: string
    paused?: boolean
  }
) {
  await requireAdmin(userId)
  if (!command.reason.trim() || command.reason.length > 500)
    throw new Error("A reason is required (maximum 500 characters)")
  return transaction(async (c) => {
    // Recheck within the transaction so revoked administrators cannot commit new changes.
    const { rows } = await c.query(
      "SELECT 1 FROM casino_admins WHERE user_id = $1 FOR SHARE",
      [userId]
    )
    if (!rows.length) throw new Error("Administrator access required")
    let before: unknown
    if (command.kind === "platform") {
      before = (
        await c.query("SELECT * FROM casino_settings WHERE id = 1 FOR UPDATE")
      ).rows[0]
      await c.query(
        "UPDATE casino_settings SET betting_paused = $1 WHERE id = 1",
        [command.paused === true]
      )
    } else if (command.kind === "priorities") {
      const entries = command.priorities
      if (
        !entries?.length ||
        entries.length > 1000 ||
        new Set(entries.map((e) => e.slug)).size !== entries.length ||
        entries.some(
          (e) => !Number.isInteger(e.priority) || Math.abs(e.priority) > 100000
        )
      )
        throw new Error("Invalid game priorities")
      before = (
        await c.query(
          "SELECT slug,sort_order FROM games ORDER BY slug FOR UPDATE"
        )
      ).rows
      for (const entry of entries) {
        const updated = await c.query(
          "UPDATE games SET sort_order=$2 WHERE slug=$1",
          [entry.slug, entry.priority]
        )
        if (!updated.rowCount) throw new Error("Game not found")
      }
    } else if (command.kind === "game") {
      if (
        !["draft", "enabled", "paused", "maintenance", "retired"].includes(
          command.status!
        )
      )
        throw new Error("Invalid status")
      if (
        command.name !== undefined &&
        (!command.name.trim() || command.name.length > 100)
      )
        throw new Error("Invalid game name")
      if (
        command.description !== undefined &&
        command.description.length > 1000
      )
        throw new Error("Description is too long")
      if (
        command.image &&
        (!/^\/[a-zA-Z0-9_/.\-]+$/.test(command.image) ||
          command.image.includes("..") ||
          command.image.startsWith("//"))
      )
        throw new Error("Use a local image path such as /games/dice.png")
      if (
        command.sortOrder !== undefined &&
        (!Number.isInteger(command.sortOrder) ||
          Math.abs(command.sortOrder) > 100000)
      )
        throw new Error("Invalid display order")
      const min = stakeCents(command.min),
        max = stakeCents(command.max),
        payout = stakeCents(command.payout)
      if (min > max || max > payout)
        throw new Error("Limits must satisfy minimum ≤ maximum ≤ payout")
      if (command.status === "enabled" && !isEngine(command.slug!))
        throw new Error("No deployed engine for this game")
      before = (
        await c.query("SELECT * FROM games WHERE slug = $1 FOR UPDATE", [
          command.slug,
        ])
      ).rows[0]
      if (!before) throw new Error("Game not found")
      await c.query(
        "INSERT INTO game_config_versions(game_slug,version,config) SELECT slug,config_version,to_jsonb(games) FROM games WHERE slug = $1 ON CONFLICT DO NOTHING",
        [command.slug]
      )
      await c.query(
        "UPDATE games SET status=$2,is_active=$3,visible=$4,min_bet_cents=$5,max_bet_cents=$6,max_payout_cents=$7,config_version=config_version+1 WHERE slug=$1",
        [
          command.slug,
          command.status,
          command.status === "enabled" ? 1 : 0,
          command.visible,
          min,
          max,
          payout,
        ]
      )
      if (command.name !== undefined)
        await c.query(
          "UPDATE games SET name=$2,description=$3,image_key=$4,sort_order=$5,category_id=$6 WHERE slug=$1",
          [
            command.slug,
            command.name.trim(),
            command.description || null,
            command.image || null,
            command.sortOrder ?? 0,
            command.categoryId || null,
          ]
        )
      await c.query(
        "INSERT INTO game_config_versions(game_slug,version,config) SELECT slug,config_version,to_jsonb(games) FROM games WHERE slug=$1",
        [command.slug]
      )
    } else if (command.kind === "restrict") {
      if (!command.target) throw new Error("Player ID required")
      // Same lock used by admission prevents restrictions racing with new bets.
      const profile = await c.query(
        "SELECT id FROM profiles WHERE id=$1 FOR UPDATE",
        [command.target]
      )
      if (!profile.rows.length) throw new Error("Player not found")
      await c.query(
        "INSERT INTO user_game_restrictions(user_id,game_slug,reason,created_by) VALUES ($1,$2,$3,$4)",
        [command.target, command.slug || null, command.reason, userId]
      )
    } else if (command.kind === "refund") {
      const {
        rows: [round],
      } = await c.query("SELECT * FROM game_rounds WHERE id=$1 FOR UPDATE", [
        command.id,
      ])
      if (!round || round.status !== "active")
        throw new Error("Only active rounds can be refunded")
      before = {
        id: round.id,
        status: round.status,
        stakeCents: round.stake_cents,
      }
      await settle(c, round, 1, {
        refunded: true,
        isWin: false,
        gameOver: true,
        isCashout: true,
        isMine: false,
        mineIndices: round.state.mines || [],
        currentMultiplier: 1,
        reason: command.reason,
      })
    } else if (command.kind === "unrestrict") {
      before = (
        await c.query(
          "DELETE FROM user_game_restrictions WHERE id=$1 RETURNING *",
          [command.id]
        )
      ).rows[0]
      if (!before) throw new Error("Restriction not found")
    } else throw new Error("Unknown command")
    await c.query(
      "INSERT INTO admin_audit_logs(actor_id,command,before_data) VALUES ($1,$2,$3)",
      [userId, JSON.stringify(command), JSON.stringify(before ?? null)]
    )
  })
}
