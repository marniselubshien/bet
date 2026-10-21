"use server"
import { startRound } from "@workspace/casino/platform"
import { playerId } from "@/lib/game-player"
import { revalidatePath } from "next/cache"
export async function playWheel(input: {
  betAmount: number
  requestId: string
  segments?: 20 | 30
}) {
  const { requestId, ...options } = input
  const result = await startRound(await playerId(), "wheel", options, requestId)
  revalidatePath("/casino", "layout")
  return {
    segmentIndex: Number(result.segmentIndex),
    multiplier: Number(result.multiplier),
    payout: result.payout,
    isWin: !!result.isWin,
  }
}
export async function playKeno(input: {
  betAmount: number
  requestId: string
  numbers: number[]
}) {
  const { requestId, ...options } = input
  const result = await startRound(await playerId(), "keno", options, requestId)
  revalidatePath("/casino", "layout")
  return {
    drawn: result.drawn as number[],
    matches: result.matches as number[],
    multiplier: Number(result.multiplier),
    payout: result.payout,
    isWin: !!result.isWin,
  }
}
