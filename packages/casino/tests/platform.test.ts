import test, { before, after } from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { randomUUID } from "node:crypto"
import { Pool } from "pg"
import {
  stakeCents,
  mineLayout,
  minesMultiplier,
  payoutCents,
  instantOutcome,
} from "../src/engines"

const testUrl = process.env.CASINO_TEST_DATABASE_URL
if (!testUrl)
  throw new Error(
    "Set CASINO_TEST_DATABASE_URL to an isolated migrated test branch"
  )
const localEnv = await readFile(
  new URL("../../../.env.local", import.meta.url),
  "utf8"
).catch(() => "")
const configuredUrl = localEnv.match(/^DATABASE_URL=["']?([^"'\r\n]+)/m)?.[1]
const host = (url: string) => new URL(url).hostname.replace("-pooler.", ".")
if (configuredUrl && host(configuredUrl) === host(testUrl))
  throw new Error(
    "Refusing to run destructive integration fixtures against the configured application database"
  )
process.env.DATABASE_URL = testUrl
const pool = new Pool({
  connectionString: testUrl,
  connectionTimeoutMillis: 15000,
})
const platform = await import("../src/platform")
const admin = "test-admin-" + randomUUID()
async function player(balance = 100) {
  const id = "test-player-" + randomUUID()
  await pool.query("INSERT INTO profiles(id,email,balance) VALUES ($1,$2,$3)", [
    id,
    id + "@example.invalid",
    balance,
  ])
  return id
}
async function balance(id: string) {
  return Number(
    (await pool.query("SELECT balance FROM profiles WHERE id=$1", [id])).rows[0]
      .balance
  )
}
const input = { betAmount: 10, minesCount: 3 }
before(async () => {
  await pool.query("INSERT INTO casino_admins(user_id) VALUES ($1)", [admin])
  await pool.query(
    "INSERT INTO casino_settings(id,betting_paused) VALUES (1,false) ON CONFLICT (id) DO UPDATE SET betting_paused=false"
  )
  for (const slug of [
    "dice",
    "limbo",
    "plinko",
    "coinflip",
    "mines",
    "crash",
    "chicken",
    "pump",
    "dragon-tower",
    "slides",
    "darts",
  ]) {
    await pool.query(
      "INSERT INTO games(slug,name,status,is_active,min_bet_cents,max_bet_cents,max_payout_cents) VALUES ($1,$1,'enabled',1,100,100000,100000000) ON CONFLICT (slug) DO UPDATE SET status='enabled',is_active=1,min_bet_cents=100,max_bet_cents=100000,max_payout_cents=100000000",
      [slug]
    )
  }
})
after(async () => {
  await pool.end()
})

test("runtime validation rejects non-finite, fractional and out of range inputs", () => {
  for (const n of [NaN, Infinity, -1, 0, 0.001])
    assert.throws(() => stakeCents(n))
  assert.throws(() => mineLayout(1.5))
  assert.throws(() => instantOutcome("dice", { targetMultiplier: Infinity }))
  assert.throws(() => instantOutcome("coinflip", { choice: "edge" }))
  assert.equal(stakeCents(0.29), 29)
  assert.equal(payoutCents(100, 1.98, 1000), 198)
  assert.equal(minesMultiplier(24, 2), 0)
})
test("duplicate requests debit once and reject changed payloads", async () => {
  const user = await player(),
    key = randomUUID()
  const [a, b] = await Promise.all([
    platform.startRound(user, "mines", input, key),
    platform.startRound(user, "mines", input, key),
  ])
  assert.equal(a.roundId, b.roundId)
  assert.equal(await balance(user), 90)
  await assert.rejects(
    platform.startRound(user, "mines", { ...input, betAmount: 11 }, key),
    /already used/
  )
  assert.equal(
    (await pool.query("SELECT * FROM wallet_entries WHERE user_id=$1", [user]))
      .rowCount,
    1
  )
})
test("simultaneous games cannot overspend the wallet", async () => {
  const user = await player(10)
  const attempts = await Promise.allSettled([
    platform.startRound(user, "mines", input, randomUUID()),
    platform.startRound(
      user,
      "crash",
      { betAmount: 10, autoCashout: 2 },
      randomUUID()
    ),
  ])
  assert.equal(attempts.filter((a) => a.status === "fulfilled").length, 1)
  assert.equal(await balance(user), 0)
})
test("pausing blocks new wagers but existing Mines rounds finish exactly once", async () => {
  const user = await player()
  const round = await platform.startRound(user, "mines", input, randomUUID())
  const state = (
    await pool.query("SELECT state FROM game_rounds WHERE id=$1", [
      round.roundId,
    ])
  ).rows[0].state
  const tile = Array.from({ length: 25 }, (_, i) => i).find(
    (i) => !state.mines.includes(i)
  )!
  await platform.actOnRound(user, "mines", round.roundId, "reveal", tile)
  await platform.adminCommand(admin, {
    kind: "game",
    slug: "mines",
    status: "paused",
    visible: true,
    min: 1,
    max: 1000,
    payout: 1000000,
    reason: "Test pause",
  })
  await assert.rejects(
    platform.startRound(await player(), "mines", input, randomUUID()),
    /unavailable/
  )
  const [a, b] = await Promise.all([
    platform.actOnRound(user, "mines", round.roundId, "cashout"),
    platform.actOnRound(user, "mines", round.roundId, "cashout"),
  ])
  assert.equal(a.payout, b.payout)
  assert.equal(await balance(user), 90 + a.payout)
  assert.equal(
    (
      await pool.query(
        "SELECT * FROM wallet_entries WHERE round_id=$1 AND kind='payout'",
        [round.roundId]
      )
    ).rowCount,
    1
  )
  await platform.adminCommand(admin, {
    kind: "game",
    slug: "mines",
    status: "enabled",
    visible: true,
    min: 1,
    max: 1000,
    payout: 1000000,
    reason: "Resume after test",
  })
})
test("round ownership and per-player restrictions are enforced", async () => {
  const owner = await player(),
    other = await player()
  const round = await platform.startRound(owner, "mines", input, randomUUID())
  await assert.rejects(
    platform.actOnRound(other, "mines", round.roundId, "cashout"),
    /not found/
  )
  await platform.adminCommand(admin, {
    kind: "restrict",
    target: other,
    slug: "dice",
    reason: "Test game restriction",
  })
  await assert.rejects(
    platform.startRound(
      other,
      "dice",
      { betAmount: 10, targetMultiplier: 2 },
      randomUUID()
    ),
    /restricted/
  )
  await platform.startRound(
    other,
    "coinflip",
    { betAmount: 1, choice: "heads" },
    randomUUID()
  )
  await platform.adminCommand(admin, {
    kind: "restrict",
    target: other,
    reason: "Test account restriction",
  })
  await assert.rejects(
    platform.startRound(
      other,
      "coinflip",
      { betAmount: 1, choice: "heads" },
      randomUUID()
    ),
    /restricted/
  )
  await assert.rejects(
    platform.adminCommand(other, {
      kind: "platform",
      paused: true,
      reason: "Unauthorized",
    }),
    /Administrator/
  )
})
test("Crash keeps the outcome secret and computes cashout from stored time", async () => {
  const user = await player()
  const round = await platform.startRound(
    user,
    "crash",
    { betAmount: 10, autoCashout: 2 },
    randomUUID()
  )
  assert.equal(round.crashPoint, undefined)
  await pool.query(
    "UPDATE game_rounds SET state = state || $2::jsonb WHERE id=$1",
    [
      round.roundId,
      JSON.stringify({ crashPoint: 5, startedAt: Date.now() - 4000 }),
    ]
  )
  const [a, b] = await Promise.all([
    platform.actOnRound(user, "crash", round.roundId, "poll"),
    platform.actOnRound(user, "crash", round.roundId, "cashout"),
  ])
  assert.equal(a.payout, 20)
  assert.equal(b.payout, 20)
  assert.equal(await balance(user), 110)
  assert.equal(
    (await pool.query("SELECT * FROM bets WHERE user_id=$1", [user])).rowCount,
    1
  )
})
test("failed settlement rolls back debit, round and wallet entries together", async () => {
  const user = await player(0)
  await assert.rejects(
    platform.startRound(
      user,
      "coinflip",
      { betAmount: 1, choice: "heads" },
      randomUUID()
    ),
    /Insufficient/
  )
  assert.equal(
    (await pool.query("SELECT * FROM game_rounds WHERE user_id=$1", [user]))
      .rowCount,
    0
  )
  assert.equal(
    (await pool.query("SELECT * FROM wallet_entries WHERE user_id=$1", [user]))
      .rowCount,
    0
  )
})
test("global pause is enforced independently of game status", async () => {
  await platform.adminCommand(admin, {
    kind: "platform",
    paused: true,
    reason: "Test platform pause",
  })
  await assert.rejects(
    platform.startRound(
      await player(),
      "dice",
      { betAmount: 1, targetMultiplier: 2 },
      randomUUID()
    ),
    /unavailable/
  )
  await platform.adminCommand(admin, {
    kind: "platform",
    paused: false,
    reason: "Resume after test",
  })
})

test("persistent Mines resumes safely, rejects overwrites, and deduplicates reveals", async () => {
  const user = await player()
  const round = await platform.startRound(user, "mines", input, randomUUID())
  assert.equal(round.mines, undefined)
  await assert.rejects(
    platform.startRound(user, "mines", input, randomUUID()),
    /existing round/
  )
  const state = (
    await pool.query("SELECT state FROM game_rounds WHERE id=$1", [
      round.roundId,
    ])
  ).rows[0].state
  const tile = Array.from({ length: 25 }, (_, i) => i).find(
    (i) => !state.mines.includes(i)
  )!
  await Promise.all([
    platform.actOnRound(user, "mines", round.roundId, "reveal", tile),
    platform.actOnRound(user, "mines", round.roundId, "reveal", tile),
  ])
  const resumed = await platform.activeRound(user, "mines")
  assert.deepEqual(resumed?.revealedIndices, [tile])
  assert.equal(resumed?.roundId, round.roundId)
  assert.equal((resumed as Record<string, unknown>).mines, undefined)
  assert.equal(
    (
      await pool.query(
        "SELECT * FROM game_events WHERE round_id=$1 AND kind='revealed'",
        [round.roundId]
      )
    ).rowCount,
    1
  )
})
test("admin refunds return the original stake once and audit the reason", async () => {
  const user = await player()
  const round = await platform.startRound(user, "mines", input, randomUUID())
  const command = {
    kind: "refund",
    id: round.roundId,
    reason: "Interrupted round recovery",
  }
  const results = await Promise.allSettled([
    platform.adminCommand(admin, command),
    platform.adminCommand(admin, command),
  ])
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1)
  assert.equal(await balance(user), 100)
  assert.equal(
    (
      await pool.query(
        "SELECT * FROM bets WHERE user_id=$1 AND result='refund'",
        [user]
      )
    ).rowCount,
    1
  )
  assert.equal(
    (
      await pool.query(
        "SELECT * FROM admin_audit_logs WHERE command->>'id'=$1",
        [round.roundId]
      )
    ).rowCount,
    1
  )
})
test("invalid configuration rolls back without publishing a version", async () => {
  const previous = (
    await pool.query("SELECT config_version FROM games WHERE slug='dice'")
  ).rows[0].config_version
  await assert.rejects(
    platform.adminCommand(admin, {
      kind: "game",
      slug: "dice",
      status: "enabled",
      min: 100,
      max: 1,
      payout: 1000,
      reason: "Invalid limits",
    }),
    /Limits/
  )
  assert.equal(
    (await pool.query("SELECT config_version FROM games WHERE slug='dice'"))
      .rows[0].config_version,
    previous
  )
})

test("Mines loss settles once and cannot be cashed out afterwards", async () => {
  const user = await player()
  const round = await platform.startRound(user, "mines", input, randomUUID())
  const { state } = (
    await pool.query("SELECT state FROM game_rounds WHERE id=$1", [
      round.roundId,
    ])
  ).rows[0]
  await assert.rejects(
    platform.actOnRound(user, "mines", round.roundId, "reveal", 0.5)
  )
  await assert.rejects(
    platform.actOnRound(user, "mines", round.roundId, "cashout")
  )
  const result = await platform.actOnRound(
    user,
    "mines",
    round.roundId,
    "reveal",
    state.mines[0]
  )
  assert.equal(result.isMine, true)
  assert.equal(result.gameOver, true)
  assert.equal(result.payout, 0)
  const retry = await platform.actOnRound(
    user,
    "mines",
    round.roundId,
    "cashout"
  )
  assert.equal(retry.payout, 0)
  assert.equal(await balance(user), 90)
  assert.equal(await platform.activeRound(user, "mines"), null)
})

test("the final safe Mines tile automatically pays the win exactly once", async () => {
  const user = await player()
  const round = await platform.startRound(
    user,
    "mines",
    { betAmount: 10, minesCount: 24 },
    randomUUID()
  )
  const { state } = (
    await pool.query("SELECT state FROM game_rounds WHERE id=$1", [
      round.roundId,
    ])
  ).rows[0]
  const tile = Array.from({ length: 25 }, (_, i) => i).find(
    (i) => !state.mines.includes(i)
  )!
  const result = await platform.actOnRound(
    user,
    "mines",
    round.roundId,
    "reveal",
    tile
  )
  assert.equal(result.gameOver, true)
  assert.equal(result.isMine, false)
  assert.equal(result.payout, 247.5)
  await platform.actOnRound(user, "mines", round.roundId, "reveal", tile)
  await platform.actOnRound(user, "mines", round.roundId, "cashout")
  assert.equal(await balance(user), 337.5)
  assert.equal(
    (
      await pool.query(
        "SELECT id FROM wallet_entries WHERE round_id=$1 AND kind='payout'",
        [round.roundId]
      )
    ).rowCount,
    1
  )
})

for (const slug of ["chicken", "pump", "dragon-tower"]) {
  test(`${slug}: active round resumes, repeated steps and cashouts settle once`, async () => {
    const user = await player(100)
    const starts = await Promise.allSettled([
      platform.startRound(user, slug, { betAmount: 10 }, randomUUID()),
      platform.startRound(user, slug, { betAmount: 10 }, randomUUID()),
    ])
    assert.equal(
      starts.filter((result) => result.status === "fulfilled").length,
      1
    )
    const round = starts.find((result) => result.status === "fulfilled")!
    assert.equal(round.status, "fulfilled")
    if (round.status !== "fulfilled") return
    const id = round.value.roundId!
    await pool.query("UPDATE game_rounds SET state=$2 WHERE id=$1", [
      id,
      JSON.stringify({ traps: Array(8).fill(3), choices: [] }),
    ])
    const [first, repeated] = await Promise.all([
      platform.actOnRound(user, slug, id, "reveal", 0),
      platform.actOnRound(user, slug, id, "reveal", 0),
    ])
    assert.equal(first.step, 1)
    assert.equal(repeated.step, 1)
    const resumed = await platform.activeRound(user, slug)
    assert.equal(resumed?.step, 1)
    assert.equal(resumed?.betAmount, 10)
    assert.equal(await balance(user), 90)
    const [a, b] = await Promise.all([
      platform.actOnRound(user, slug, id, "cashout"),
      platform.actOnRound(user, slug, id, "cashout"),
    ])
    assert.equal(a.payout, 13.2)
    assert.equal(b.payout, 13.2)
    assert.equal(await balance(user), 103.2)
    assert.equal(await platform.activeRound(user, slug), null)
  })
}
