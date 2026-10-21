import { randomInt } from "node:crypto"
import { kenoPayouts } from "../catalog"

export function keno(input: Record<string, unknown>) {
  if (
    !Array.isArray(input.numbers) ||
    input.numbers.length < 1 ||
    input.numbers.length > 10 ||
    input.numbers.some((n) => !Number.isInteger(n) || n < 1 || n > 40) ||
    new Set(input.numbers).size !== input.numbers.length
  ) {
    throw new Error("Choose 1 to 10 unique numbers between 1 and 40")
  }
  const numbers = [...input.numbers].sort((a, b) => a - b) as number[]
  const pool = Array.from({ length: 40 }, (_, i) => i + 1)
  for (let i = 0; i < 10; i++) {
    const j = randomInt(i, pool.length)
    ;[pool[i], pool[j]] = [pool[j]!, pool[i]!]
  }
  const drawn = pool.slice(0, 10)
  const matches = numbers.filter((n) => drawn.includes(n))
  const multiplier = kenoPayouts(numbers.length)[matches.length]!
  return { numbers, drawn, matches, multiplier, isWin: multiplier > 0 }
}
