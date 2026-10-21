"use server"
import { startRound } from "@workspace/casino/platform"
import { playerId } from "@/lib/game-player"
import { revalidatePath } from "next/cache"
export async function dropPlinkoBall(input: {
  betAmount: number
  rows?: 10 | 16
  requestId: string
}) {
  const { requestId, ...options } = input
  const result = await startRound(
    await playerId(),
    "plinko",
    options,
    requestId
  )
  revalidatePath("/casino", "layout")
  return result
}
