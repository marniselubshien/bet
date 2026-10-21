"use server"
import { startRound, actOnRound, activeRound } from "@workspace/casino/platform"
import { playerId } from "@/lib/game-player"
import { revalidatePath } from "next/cache"
export async function placeCrashBet(input: {
  betAmount: number
  autoCashout: number
  requestId: string
}) {
  const { requestId, ...options } = input
  const result = await startRound(await playerId(), "crash", options, requestId)
  revalidatePath("/casino", "layout")
  return result
}
export async function resumeCrashGame() {
  return activeRound(await playerId(), "crash")
}
export async function resolveCrashGame(
  roundId: string,
  action: "cashout" | "poll" = "poll"
) {
  const result = await actOnRound(await playerId(), "crash", roundId, action)
  if (result.gameOver) revalidatePath("/casino", "layout")
  return result
}
