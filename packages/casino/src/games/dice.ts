import { finite, random } from "../game-utils"
export function dice(input: Record<string, unknown>) {
  const multiplier = finite(input.targetMultiplier, 1.01, 1000000, "multiplier")
  const roll = random() * 100
  return {
    multiplier,
    isWin: roll < 99 / multiplier,
    roll,
    winChance: 99 / multiplier,
  }
}
