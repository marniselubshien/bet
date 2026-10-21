import { randomInt } from "node:crypto"
import { finite } from "../game-utils"
export function mineLayout(count: number) {
  finite(count, 1, 24, "mines count")
  if (!Number.isInteger(count)) throw new Error("Invalid mines count")
  const tiles = Array.from({ length: 25 }, (_, i) => i)
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[tiles[i], tiles[j]] = [tiles[j]!, tiles[i]!]
  }
  return tiles.slice(0, count)
}
export function minesMultiplier(count: number, revealed: number) {
  if (!revealed) return 1
  if (revealed > 25 - count) return 0
  let m = 0.99
  for (let i = 0; i < revealed; i++) m *= (25 - i) / (25 - count - i)
  return Math.floor(m * 100) / 100
}
