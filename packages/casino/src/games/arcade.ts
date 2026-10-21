import { randomInt } from "node:crypto"
import { SLIDE_PAYOUTS, DART_PAYOUTS } from "../catalog"
export function slides(_input: Record<string, unknown>) {
  const index = randomInt(SLIDE_PAYOUTS.length)
  const multiplier = SLIDE_PAYOUTS[index]!
  return { index, multiplier, isWin: multiplier > 0 }
}
// Weighted rings, with a separately randomized visual angle.
export function darts(_input: Record<string, unknown>) {
  const ticket = randomInt(100)
  const limits = [30, 50, 70, 85, 95, 98, 99, 100]
  const index = limits.findIndex((limit) => ticket < limit)
  const multiplier = DART_PAYOUTS[index]!
  const angle = randomInt(360)
  return { index, angle, multiplier, isWin: multiplier > 0 }
}
