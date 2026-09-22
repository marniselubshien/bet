"use server";

import { db } from "@/db";
import { bets, profiles } from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function placeLimboBet({ betAmount, targetMultiplier }: { betAmount: number; targetMultiplier: number }) {
  const { data: session } = await auth.getSession();
  if (!session?.user) throw new Error("Unauthorized. Please sign in to play.");

  if (betAmount <= 0) throw new Error("Invalid bet amount");
  if (targetMultiplier < 1.01 || targetMultiplier > 1000000) {
    throw new Error("Target multiplier must be between 1.01x and 1,000,000x");
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, session.user.id),
  });

  if (!profile || Number(profile.balance) < betAmount) {
    throw new Error("Insufficient balance");
  }

  // Stake Limbo formula: 99 / (1 - float), max 1,000,000
  // Standard provably fair / random roll:
  const float = Math.random();
  const rawMultiplier = 99 / (100 - float * 99);
  const roll = Number((rawMultiplier).toFixed(2));
  
  const isWin = roll >= targetMultiplier;
  const payoutAmount = isWin ? Number((betAmount * targetMultiplier).toFixed(2)) : 0;
  const profit = isWin ? payoutAmount - betAmount : -betAmount;

  // Update user balance
  await db.update(profiles)
    .set({ balance: sql`${profiles.balance} + ${profit}` })
    .where(eq(profiles.id, session.user.id));

  // Record bet
  await db.insert(bets).values({
    userId: session.user.id,
    gameSlug: 'limbo',
    betAmount: betAmount.toString(),
    payoutAmount: payoutAmount.toString(),
    multiplier: targetMultiplier.toString(),
    result: isWin ? 'win' : 'lose',
    gameData: { targetMultiplier, rollResult: roll },
  });

  revalidatePath('/casino');

  return {
    isWin,
    roll,
    payout: payoutAmount,
    profit,
    newBalance: Number(profile.balance) + profit,
  };
}
