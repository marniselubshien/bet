"use server";

import { db } from "@/db";
import { bets, profiles } from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const MULTIPLIERS = [16, 9, 2, 1.4, 0.4, 0.2, 0.4, 1.4, 2, 9, 16];

export async function dropPlinkoBall({ betAmount }: { betAmount: number }) {
  const { data: session } = await auth.getSession();
  if (!session?.user) throw new Error("Unauthorized. Please sign in to play.");

  if (betAmount <= 0) throw new Error("Invalid bet amount");

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, session.user.id),
  });

  if (!profile || Number(profile.balance) < betAmount) {
    throw new Error("Insufficient balance");
  }

  // Simulate 10 pin bounces (left=0, right=1)
  const rows = 10;
  const path: number[] = [];
  let index = 0;
  for (let r = 0; r < rows; r++) {
    const step = Math.random() < 0.5 ? 0 : 1;
    path.push(step);
    index += step;
  }

  const multiplier = MULTIPLIERS[index] ?? 1;
  const payoutAmount = Number((betAmount * multiplier).toFixed(2));
  const profit = payoutAmount - betAmount;
  const isWin = multiplier >= 1;

  await db.update(profiles)
    .set({ balance: sql`${profiles.balance} + ${profit}` })
    .where(eq(profiles.id, session.user.id));

  await db.insert(bets).values({
    userId: session.user.id,
    gameSlug: 'plinko',
    betAmount: betAmount.toString(),
    payoutAmount: payoutAmount.toString(),
    multiplier: multiplier.toString(),
    result: isWin ? 'win' : 'lose',
    gameData: { path, bucketIndex: index },
  });

  revalidatePath('/casino');

  return {
    path,
    bucketIndex: index,
    multiplier,
    payout: payoutAmount,
    profit,
    isWin,
    newBalance: Number(profile.balance) + profit,
  };
}
