import test from "node:test"
import assert from "node:assert/strict"
import {
  advanceJourney,
  newJourney,
  journeyMultiplier,
  journeyView,
} from "../src/games/journey"
import { slides, darts } from "../src/games/arcade"
import { engineKeys, SLIDE_PAYOUTS, DART_PAYOUTS } from "../src/catalog"
test("All five games have registered engines", () => {
  for (const slug of ["chicken", "pump", "slides", "darts", "dragon-tower"])
    assert.ok((engineKeys as readonly string[]).includes(slug))
})
test("Journey hides traps in the public view, rejects future steps, and replays safely", () => {
  const state = { traps: Array(8).fill(3), choices: [] as number[] }
  assert.equal((journeyView(state) as Record<string, unknown>).traps, undefined)
  assert.throws(() => advanceJourney(state, 4), /next level/)
  assert.throws(() => advanceJourney(state, 0.5), /Invalid/)
  const first = advanceJourney(state, 0)
  assert.equal(first.lost, false)
  assert.equal(first.state.choices.length, 1)
  assert.equal(advanceJourney(first.state, 0).replayed, true)
  assert.equal(advanceJourney(first.state, 7).lost, true)
  assert.deepEqual(state.choices, [])
})
test("Journey multipliers are monotonic and preserve the house edge", () => {
  for (let i = 1; i <= 8; i++) {
    assert.ok(journeyMultiplier(i) > journeyMultiplier(i - 1))
    assert.ok(Math.pow(0.75, i) * journeyMultiplier(i) <= 0.99 + 1e-10)
  }
  for (let i = 0; i < 100; i++) {
    const s = newJourney()
    assert.equal(s.traps.length, 8)
    assert.ok(s.traps.every((x) => Number.isInteger(x) && x >= 0 && x < 4))
  }
})
test("Instant arcade outcomes match their payout tables and 99% return", () => {
  assert.ok(
    Math.abs(SLIDE_PAYOUTS.reduce((a, b) => a + b, 0) / 20 - 0.99) < 1e-10
  )
  const weights = [30, 20, 20, 15, 10, 3, 1, 1]
  assert.ok(
    Math.abs(
      DART_PAYOUTS.reduce((sum, m, i) => sum + (m * weights[i]!) / 100, 0) -
        0.99
    ) < 1e-10
  )
  for (let i = 0; i < 100; i++) {
    const slide = slides({})
    assert.equal(slide.multiplier, SLIDE_PAYOUTS[slide.index])
    const dart = darts({})
    assert.equal(dart.multiplier, DART_PAYOUTS[dart.index])
    assert.ok(dart.angle >= 0 && dart.angle < 360)
  }
})
