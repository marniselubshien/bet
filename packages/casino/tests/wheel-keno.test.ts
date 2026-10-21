import test from "node:test"
import assert from "node:assert/strict"
import {
  isEngine,
  WHEEL_SEGMENTS,
  WHEEL_TABLES,
  kenoPayouts,
  combinations,
} from "../src/catalog"
import { instantOutcome } from "../src/engines"
import { keno } from "../src/games/keno"
import { wheel } from "../src/games/wheel"
test("Wheel and Keno are registered deployed engines", () => {
  for (const slug of ["wheel", "keno"]) {
    assert.equal(isEngine(slug), true)
    assert.doesNotThrow(() =>
      instantOutcome(slug, { numbers: [1, 2, 3, 4, 5] })
    )
  }
  assert.equal(isEngine("undeployed-game"), false)
})
test("Wheel lands on a configured segment and has 99% expected return", () => {
  assert.equal(WHEEL_SEGMENTS.length, 20)
  assert.ok(
    Math.abs(WHEEL_SEGMENTS.reduce((a, b) => a + b, 0) / 20 - 0.99) < 1e-10
  )
  for (let i = 0; i < 100; i++) {
    const result = wheel({})
    assert.equal(result.multiplier, WHEEL_SEGMENTS[result.segmentIndex])
    assert.equal(result.isWin, result.multiplier > 0)
  }
})
test("Keno draws ten unique valid numbers and pays its published hit table", () => {
  for (let picks = 1; picks <= 10; picks++) {
    const numbers = Array.from({ length: picks }, (_, i) => i + 1)
    for (let i = 0; i < 20; i++) {
      const result = keno({ numbers })
      assert.equal(result.drawn.length, 10)
      assert.equal(new Set(result.drawn).size, 10)
      assert.ok(result.drawn.every((n) => n >= 1 && n <= 40))
      assert.deepEqual(
        result.matches,
        numbers.filter((n) => result.drawn.includes(n))
      )
      assert.equal(result.multiplier, kenoPayouts(picks)[result.matches.length])
      assert.equal(result.isWin, result.multiplier > 0)
    }
    const expectation = kenoPayouts(picks).reduce(
      (sum, payout, hits) =>
        sum +
        (payout * combinations(10, hits) * combinations(30, picks - hits)) /
          combinations(40, picks),
      0
    )
    assert.ok(expectation <= 0.99 + 1e-10)
    assert.ok(expectation > 0.98)
  }
})
test("Keno rejects malformed selections before settlement", () => {
  for (const numbers of [
    undefined,
    [],
    [0],
    [41],
    [1, 1],
    [1.5],
    [NaN],
    ["1"],
    Array.from({ length: 11 }, (_, i) => i + 1),
  ])
    assert.throws(() => keno({ numbers }), /Choose/)
})

test("Wheel segment settings match the server landing table", () => {
  for (const segments of [20, 30] as const) {
    const table = WHEEL_TABLES[segments]
    assert.equal(table.length, segments)
    assert.ok(
      Math.abs(table.reduce((sum, value) => sum + value, 0) / segments - 0.99) <
        1e-10
    )
    for (let i = 0; i < 100; i++) {
      const result = wheel({ segments })
      assert.equal(result.segments, segments)
      assert.equal(result.multiplier, table[result.segmentIndex])
    }
  }
  for (const segments of [10, 0, 31, 20.5, "30", NaN])
    assert.throws(() => wheel({ segments }), /Invalid Wheel segments/)
})
