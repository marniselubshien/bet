"use server"
import {
  activeRound,
  actOnRound,
  startRound,
  type ActionResult,
} from "@workspace/casino/platform"
import { ARCADE_GAMES, isJourneyGame } from "@workspace/casino/catalog"
import { playerId } from "@/lib/game-player"
import { revalidatePath } from "next/cache"
function validate(slug: string) {
  if (!ARCADE_GAMES.some((game) => game.slug === slug))
    throw new Error("Unsupported game")
}
function publicView(res: ActionResult) {
  return {
    betAmount: Number(res.betAmount ?? 10),
    roundId: typeof res.roundId === "string" ? res.roundId : undefined,
    step: Number(res.step ?? 0),
    choices: (res.choices ?? []) as number[],
    currentMultiplier: Number(res.currentMultiplier ?? res.multiplier ?? 1),
    nextMultiplier: Number(res.nextMultiplier ?? 1),
    payout: Number(res.payout ?? 0),
    gameOver: !!res.gameOver || res.refunded === true,
    refunded: res.refunded === true,
    isWin: !!res.isWin,
    index: Number(res.index ?? 0),
    angle: Number(res.angle ?? 0),
    failedStep:
      res.failedStep === undefined ? undefined : Number(res.failedStep),
  }
}
export async function startArcade(
  slug: string,
  input: { betAmount: number; requestId: string }
) {
  validate(slug)
  const { requestId, ...options } = input
  const res = await startRound(await playerId(), slug, options, requestId)
  revalidatePath("/casino", "layout")
  return publicView(res)
}
export async function resumeArcade(slug: string) {
  validate(slug)
  if (!isJourneyGame(slug)) return null
  const res = await activeRound(await playerId(), slug)
  return res ? publicView(res) : null
}
export async function advanceArcade(
  slug: string,
  roundId: string,
  action: "reveal" | "cashout",
  tile?: number
) {
  validate(slug)
  if (!isJourneyGame(slug)) throw new Error("This game has no active session")
  const res = await actOnRound(await playerId(), slug, roundId, action, tile)
  revalidatePath("/casino", "layout")
  return publicView(res)
}
