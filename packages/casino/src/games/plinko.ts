import { randomInt } from "node:crypto"
import { PLINKO_TABLES, type PlinkoRows } from "../catalog"
export function plinko(input: Record<string, unknown>) {
  const rows = input.rows ?? 10
  if (rows !== 10 && rows !== 16) throw new Error("Invalid Plinko rows")
  const path = Array.from({ length: rows }, () => randomInt(2))
  const bucketIndex = path.reduce((a, b) => a + b, 0)
  const multiplier = PLINKO_TABLES[rows as PlinkoRows][bucketIndex]!
  return { multiplier, isWin: multiplier >= 1, path, bucketIndex, rows }
}
