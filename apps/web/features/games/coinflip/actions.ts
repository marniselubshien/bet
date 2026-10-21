"use server"
import { startRound } from "@workspace/casino/platform"
import { playerId } from "@/lib/game-player"
import { revalidatePath } from "next/cache"
export async function placeCoinflipBet(input: {
  betAmount: number
  choice: "heads" | "tails"
  requestId: string
}) {
  const { requestId, ...options } = input
  const result = await startRound(
    await playerId(),
    "coinflip",
    options,
    requestId
  )
  revalidatePath("/casino", "layout")
  return result
}
