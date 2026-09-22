"use server";

import { db } from "@/db";
import { bets, profiles } from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function placeCoinflipBet({ betAmount, choice }: { betAmount: number; choice: 'heads' | 'tails' }) {
  const { data: session } = await auth.getSession();
  if (!session?.user) throw new Error("Unauthorized. Please sign in to play.");

  if (betAmount <= 0) throw new Error("Invalid bet amount");

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, session.user.id),
  });

  if (!profile || Number(profile.balance) < betAmount) {
    throw new Error("Insufficient balance");
  }

  const flipOutcome: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';
  const isWin = choice === flipOutcome;
  const multiplier = 1.98;
  const payoutAmount = isWin ? Number((betAmount * multiplier).toFixed(2)) : 0;
  const profit = isWin ? payoutAmount - betAmount : -betAmount;

  await db.update(profiles)
    .set({ balance: sql`${profiles.balance} + ${profit}` })
    .where(eq(profiles.id, session.user.id));

  await db.insert(bets).values({
    userId: session.user.id,
    gameSlug: 'coinflip',
    betAmount: betAmount.toString(),
    payoutAmount: payoutAmount.toString(),
    multiplier: isWin ? multiplier.toString() : "0.00",
    result: isWin ? 'win' : 'lose',
    gameData: { playerChoice: choice, outcome: flipOutcome },
  });

  revalidatePath('/casino');

  return {
    isWin,
    outcome: flipOutcome,
    payout: payoutAmount,
    profit,
    newBalance: Number(profile.balance) + profit,
  };
}
