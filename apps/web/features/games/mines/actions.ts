"use server"
import { startRound, actOnRound, activeRound } from "@workspace/casino/platform"
import { playerId } from "@/lib/game-player"
import { revalidatePath } from "next/cache"
export async function startMinesGame(input: {
  betAmount: number
  minesCount: number
  requestId: string
}) {
  const { requestId, ...options } = input
  const result = await startRound(await playerId(), "mines", options, requestId)
  revalidatePath("/casino", "layout")
  return result
}
export async function resumeMinesGame() {
  return activeRound(await playerId(), "mines")
}
export async function revealMinesTile(roundId: string, tile: number) {
  const result = await actOnRound(
    await playerId(),
    "mines",
    roundId,
    "reveal",
    tile
  )
  revalidatePath("/casino", "layout")
  return result
}
export async function cashoutMines(roundId: string) {
  const result = await actOnRound(await playerId(), "mines", roundId, "cashout")
  revalidatePath("/casino", "layout")
  return result
}
