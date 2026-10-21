import { finite, random } from "../game-utils"
export function limbo(input: Record<string, unknown>) {
  const multiplier = finite(input.targetMultiplier, 1.01, 1000000, "multiplier")
  const roll = Math.min(
    1000000,
    Math.floor((0.99 / (1 - random())) * 100) / 100
  )
  return { multiplier, isWin: roll >= multiplier, roll }
}
