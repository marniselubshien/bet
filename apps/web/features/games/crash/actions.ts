"use server";

import { db } from "@/db";
import { bets, profiles } from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function placeCrashBet({ betAmount, autoCashout }: { betAmount: number; autoCashout?: number }) {
  const { data: session } = await auth.getSession();
  if (!session?.user) throw new Error("Unauthorized. Please sign in to play.");

  if (betAmount <= 0) throw new Error("Invalid bet amount");

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, session.user.id),
  });

  if (!profile || Number(profile.balance) < betAmount) {
    throw new Error("Insufficient balance");
  }

  // Crash point calculation using standard formula:
  // 1% instant crash at 1.00x (house edge)
  // otherwise: 99 / (100 - r * 99)
  const rand = Math.random();
  let crashPoint = 1.00;
  if (rand > 0.03) {
    crashPoint = Number((99 / (100 - rand * 97)).toFixed(2));
  }

  // Deduct initial bet
  await db.update(profiles)
    .set({ balance: sql`${profiles.balance} - ${betAmount}` })
    .where(eq(profiles.id, session.user.id));

  revalidatePath('/casino');

  return {
    success: true,
    crashPoint,
    betAmount,
    newBalance: Number(profile.balance) - betAmount,
  };
}

export async function resolveCrashGame({ 
  betAmount, 
  cashoutMultiplier, 
  crashPoint, 
  isWin 
}: { 
  betAmount: number; 
  cashoutMultiplier: number; 
  crashPoint: number; 
  isWin: boolean; 
}) {
  const { data: session } = await auth.getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const payoutAmount = isWin ? Number((betAmount * cashoutMultiplier).toFixed(2)) : 0;

  if (isWin && payoutAmount > 0) {
    await db.update(profiles)
      .set({ balance: sql`${profiles.balance} + ${payoutAmount}` })
      .where(eq(profiles.id, session.user.id));
  }

  await db.insert(bets).values({
    userId: session.user.id,
    gameSlug: 'crash',
    betAmount: betAmount.toString(),
    payoutAmount: payoutAmount.toString(),
    multiplier: isWin ? cashoutMultiplier.toString() : "0.00",
    result: isWin ? 'win' : 'lose',
    gameData: { crashPoint, cashedOutAt: cashoutMultiplier },
  });

  revalidatePath('/casino');

  return {
    payout: payoutAmount,
    isWin,
  };
}
