import { randomInt } from "node:crypto"
export function finite(
  value: unknown,
  min: number,
  max: number,
  name: string
): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < min ||
    value > max
  )
    throw new Error(`Invalid ${name}`)
  return value
}
export function stakeCents(value: unknown) {
  const n = finite(value, 0.01, 1000000, "bet amount")
  if (Math.abs(n * 100 - Math.round(n * 100)) > 0.000001)
    throw new Error("Use at most two decimal places")
  return Math.round(n * 100)
}
export const random = () => randomInt(0, 2 ** 47) / 2 ** 47
export function payoutCents(
  stake: number,
  multiplier: number,
  maximum: number
) {
  const payout = Math.floor(stake * multiplier + 1e-7)
  if (!Number.isSafeInteger(payout) || payout > maximum)
    throw new Error("Maximum payout exceeded")
  return payout
}
