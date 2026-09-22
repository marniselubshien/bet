"use server";

import { db } from "@/db";
import { bets, profiles } from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function placeDiceBet({ betAmount, targetMultiplier }: { betAmount: number, targetMultiplier: number }) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (betAmount <= 0) throw new Error("Invalid bet amount");
  
  // A simple dice logic (0 to 100)
  // Win chance = 99 / targetMultiplier
  const winChance = 99 / targetMultiplier;
  const roll = Math.random() * 100;
  const isWin = roll <= winChance;
  
  const payoutAmount = isWin ? betAmount * targetMultiplier : 0;
  const profit = isWin ? payoutAmount - betAmount : -betAmount;

  // In a real app, you would use a DB transaction here to ensure consistency.
  // For simplicity:
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, session.user.id)
  });

  if (!profile || Number(profile.balance) < betAmount) {
    throw new Error("Insufficient balance");
  }

  // Update balance
  await db.update(profiles)
    .set({ balance: sql`${profiles.balance} + ${profit}` })
    .where(eq(profiles.id, session.user.id));

  // Record bet
  const [bet] = await db.insert(bets).values({
    userId: session.user.id,
    gameSlug: 'dice',
    betAmount: betAmount.toString(),
    payoutAmount: payoutAmount.toString(),
    multiplier: targetMultiplier.toString(),
    result: isWin ? 'win' : 'lose',
    gameData: { roll, winChance }
  }).returning();

  revalidatePath('/casino'); // Refresh balance on client
  
  return {
    success: true,
    isWin,
    roll,
    payout: payoutAmount,
    newBalance: Number(profile.balance) + profit
  };
}
