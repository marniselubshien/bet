"use server"
import { startRound } from "@workspace/casino/platform"
import { playerId } from "@/lib/game-player"
import { revalidatePath } from "next/cache"
export async function placeLimboBet(input: {
  betAmount: number
  targetMultiplier: number
  requestId: string
}) {
  const { requestId, ...options } = input
  const result = await startRound(await playerId(), "limbo", options, requestId)
  revalidatePath("/casino", "layout")
  return result
}
