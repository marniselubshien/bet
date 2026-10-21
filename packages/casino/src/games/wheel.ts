import { randomInt } from "node:crypto"
import { WHEEL_TABLES } from "../catalog"

export function wheel(input: Record<string, unknown>) {
  const segments = input.segments ?? 20
  if (segments !== 20 && segments !== 30)
    throw new Error("Invalid Wheel segments")
  const table = WHEEL_TABLES[segments]
  const segmentIndex = randomInt(table.length)
  const multiplier = table[segmentIndex]!
  return { segmentIndex, multiplier, isWin: multiplier > 0, segments }
}
