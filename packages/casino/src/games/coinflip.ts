import { finite, random } from "../game-utils"
export function coinflip(input: Record<string, unknown>) {
  if (input.choice !== "heads" && input.choice !== "tails")
    throw new Error("Invalid choice")
  const outcome: "heads" | "tails" = random() < 0.5 ? "heads" : "tails"
  return { multiplier: 1.98, isWin: input.choice === outcome, outcome }
}
