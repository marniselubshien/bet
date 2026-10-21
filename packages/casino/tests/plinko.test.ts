import test from "node:test"
import assert from "node:assert/strict"
import { plinko } from "../src/games/plinko"
import { PLINKO_TABLES } from "../src/catalog"
for (const rows of [10, 16] as const) {
  test(`Plinko ${rows} rows: paths land in the server-selected payout bucket`, () => {
    for (let i = 0; i < 100; i++) {
      const result = plinko({ rows })
      assert.equal(result.path.length, rows)
      assert.ok(result.path.every((v) => v === 0 || v === 1))
      assert.equal(
        result.bucketIndex,
        result.path.reduce((sum, v) => sum + v, 0)
      )
      assert.equal(result.multiplier, PLINKO_TABLES[rows][result.bucketIndex])
    }
  })
}
test("Plinko preserves legacy rows and rejects unsupported row counts", () => {
  assert.equal(plinko({}).path.length, 10)
  for (const rows of [0, 8, 15, 17, "16", NaN, 10.5])
    assert.throws(() => plinko({ rows }), /Invalid Plinko rows/)
})
