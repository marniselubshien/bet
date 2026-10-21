export const engineKeys = [
  "dice",
  "limbo",
  "coinflip",
  "plinko",
  "mines",
  "crash",
  "wheel",
  "keno",
  "chicken",
  "pump",
  "slides",
  "darts",
  "dragon-tower",
] as const
export type EngineKey = (typeof engineKeys)[number]
export function isEngine(key: string): key is EngineKey {
  return engineKeys.includes(key as EngineKey)
}
export const PLINKO_MULTIPLIERS = [16, 9, 2, 1.4, 0.4, 0.2, 0.4, 1.4, 2, 9, 16]
export const PLINKO_TABLES = {
  10: PLINKO_MULTIPLIERS,
  16: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110],
} as const
export type PlinkoRows = keyof typeof PLINKO_TABLES

// Twenty equally likely segments; average payout is 0.99× the stake.
export const WHEEL_SEGMENTS = [
  0, 1.2, 0, 1.5, 1.2, 2, 0, 1.2, 1.5, 0, 2, 1.2, 0, 1.5, 1.2, 0.6, 2, 0, 1.5,
  1.2,
]

// Medium, 30 segments: 15 misses and 15 payouts; total return 29.7 / 30.
export const WHEEL_TABLES = {
  20: WHEEL_SEGMENTS,
  30: [
    0, 1.5, 0, 2, 0, 1.5, 0, 3, 0, 2, 0, 1.5, 0, 2, 0, 4, 0, 2, 0, 1.5, 0, 1.7,
    0, 2, 0, 1.5, 0, 2, 0, 1.5,
  ],
} as const
export type WheelSegments = keyof typeof WHEEL_TABLES

export function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0
  let value = 1
  for (let i = 1; i <= k; i++) value = (value * (n - i + 1)) / i
  return value
}

// A 40-number board, 10-number draw, and 1–10 picks. Normalize the payout
// weights to 99% expected return, rounding down to two decimal places.
export function kenoPayouts(picks: number): number[] {
  if (!Number.isInteger(picks) || picks < 1 || picks > 10)
    throw new Error("Choose 1 to 10 Keno numbers")
  const weights = Array.from({ length: picks + 1 }, (_, hits) =>
    hits >= Math.ceil(picks / 2) ? 4 ** hits : 0
  )
  const expectation = weights.reduce(
    (sum, weight, hits) =>
      sum +
      (weight * combinations(10, hits) * combinations(30, picks - hits)) /
        combinations(40, picks),
    0
  )
  return weights.map(
    (weight) => Math.floor(((weight * 0.99) / expectation) * 100) / 100
  )
}

export const isJourneyGame = (slug: string) =>
  ["chicken", "pump", "dragon-tower"].includes(slug)
export const ARCADE_GAMES = [
  {
    slug: "chicken",
    name: "Chicken",
    description: "Cross eight lanes, avoid traffic, and cash out.",
  },
  {
    slug: "pump",
    name: "Pump",
    description: "Inflate the balloon and cash out before it bursts.",
  },
  {
    slug: "slides",
    name: "Slides",
    description: "Slide the payout strip beneath the pointer.",
  },
  {
    slug: "darts",
    name: "Darts",
    description: "Throw at the target and reveal a payout ring.",
  },
  {
    slug: "dragon-tower",
    name: "Dragon Tower",
    description: "Climb eight levels, avoid traps, and cash out.",
  },
] as const

export const SLIDE_PAYOUTS = [
  0, 1.2, 0, 1.5, 1.2, 2, 0, 1.2, 1.5, 0, 2, 1.2, 0, 1.5, 1.2, 0.6, 2, 0, 1.5,
  1.2,
]
export const DART_PAYOUTS = [0, 0.5, 1, 1.5, 2.25, 3, 5, 10]
