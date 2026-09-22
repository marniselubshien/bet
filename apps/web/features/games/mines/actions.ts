"use server";

import { db } from "@/db";
import { bets, profiles } from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Calculate multiplier for mines based on total tiles (25), mines count, and diamonds revealed
function calculateMinesMultiplier(minesCount: number, revealedCount: number): number {
  if (revealedCount === 0) return 1;
  let mult = 1;
  for (let i = 0; i < revealedCount; i++) {
    mult *= (25 - i) / (25 - minesCount - i);
  }
  // 99% RTP (1% house edge)
  return Number((mult * 0.99).toFixed(2));
}

// In-memory or session active games map for current sessions
interface ActiveMinesGame {
  userId: string;
  betAmount: number;
  minesCount: number;
  mineIndices: number[];
  revealedIndices: number[];
}

const activeMinesGames = new Map<string, ActiveMinesGame>();

export async function startMinesGame({ betAmount, minesCount }: { betAmount: number; minesCount: number }) {
  const { data: session } = await auth.getSession();
  if (!session?.user) throw new Error("Unauthorized. Please sign in to play.");

  if (betAmount <= 0) throw new Error("Invalid bet amount");
  if (minesCount < 1 || minesCount > 24) throw new Error("Mines count must be between 1 and 24");

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, session.user.id),
  });

  if (!profile || Number(profile.balance) < betAmount) {
    throw new Error("Insufficient balance");
  }

  // Deduct initial bet
  await db.update(profiles)
    .set({ balance: sql`${profiles.balance} - ${betAmount}` })
    .where(eq(profiles.id, session.user.id));

  // Generate random mine indices
  const allIndices = Array.from({ length: 25 }, (_, i) => i);
  const shuffled = allIndices.sort(() => 0.5 - Math.random());
  const mineIndices = shuffled.slice(0, minesCount);

  activeMinesGames.set(session.user.id, {
    userId: session.user.id,
    betAmount,
    minesCount,
    mineIndices,
    revealedIndices: [],
  });

  revalidatePath('/casino');

  return {
    started: true,
    minesCount,
    revealedIndices: [],
    currentMultiplier: 1,
    nextMultiplier: calculateMinesMultiplier(minesCount, 1),
    newBalance: Number(profile.balance) - betAmount,
  };
}

export async function revealMinesTile(tileIndex: number) {
  const { data: session } = await auth.getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const game = activeMinesGames.get(session.user.id);
  if (!game) throw new Error("No active game found. Start a new game.");

  if (tileIndex < 0 || tileIndex > 24) throw new Error("Invalid tile index");
  if (game.revealedIndices.includes(tileIndex)) throw new Error("Tile already revealed");

  // Check if hit a mine
  const isMine = game.mineIndices.includes(tileIndex);

  if (isMine) {
    // Player lost
    activeMinesGames.delete(session.user.id);

    // Record losing bet
    await db.insert(bets).values({
      userId: session.user.id,
      gameSlug: 'mines',
      betAmount: game.betAmount.toString(),
      payoutAmount: "0.00",
      multiplier: "0.00",
      result: 'lose',
      gameData: { minesCount: game.minesCount, hitMineAt: tileIndex, allMines: game.mineIndices },
    });

    revalidatePath('/casino');

    return {
      isMine: true,
      mineIndices: game.mineIndices,
      allMines: game.mineIndices,
      gameOver: true,
      payout: 0,
    };
  }

  // Safe diamond revealed
  game.revealedIndices.push(tileIndex);
  const revealedCount = game.revealedIndices.length;
  const currentMultiplier = calculateMinesMultiplier(game.minesCount, revealedCount);
  const nextMultiplier = calculateMinesMultiplier(game.minesCount, revealedCount + 1);
  const totalSafeTiles = 25 - game.minesCount;

  // If player uncovered all safe diamonds, auto cashout win
  if (revealedCount === totalSafeTiles) {
    activeMinesGames.delete(session.user.id);
    const payoutAmount = game.betAmount * currentMultiplier;

    await db.update(profiles)
      .set({ balance: sql`${profiles.balance} + ${payoutAmount}` })
      .where(eq(profiles.id, session.user.id));

    await db.insert(bets).values({
      userId: session.user.id,
      gameSlug: 'mines',
      betAmount: game.betAmount.toString(),
      payoutAmount: payoutAmount.toFixed(2),
      multiplier: currentMultiplier.toString(),
      result: 'win',
      gameData: { minesCount: game.minesCount, revealedCount, allMines: game.mineIndices },
    });

    revalidatePath('/casino');

    return {
      isMine: false,
      tileIndex,
      revealedIndices: game.revealedIndices,
      allMines: game.mineIndices,
      currentMultiplier,
      nextMultiplier: 0,
      gameOver: true,
      isCashout: true,
      payout: payoutAmount,
    };
  }

  return {
    isMine: false,
    tileIndex,
    revealedIndices: game.revealedIndices,
    currentMultiplier,
    nextMultiplier,
    gameOver: false,
  };
}

export async function cashoutMines() {
  const { data: session } = await auth.getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const game = activeMinesGames.get(session.user.id);
  if (!game) throw new Error("No active game found.");
  if (game.revealedIndices.length === 0) throw new Error("Reveal at least one tile before cashing out.");

  const currentMultiplier = calculateMinesMultiplier(game.minesCount, game.revealedIndices.length);
  const payoutAmount = Number((game.betAmount * currentMultiplier).toFixed(2));

  activeMinesGames.delete(session.user.id);

  // Credit balance
  await db.update(profiles)
    .set({ balance: sql`${profiles.balance} + ${payoutAmount}` })
    .where(eq(profiles.id, session.user.id));

  // Record bet
  await db.insert(bets).values({
    userId: session.user.id,
    gameSlug: 'mines',
    betAmount: game.betAmount.toString(),
    payoutAmount: payoutAmount.toString(),
    multiplier: currentMultiplier.toString(),
    result: 'win',
    gameData: { minesCount: game.minesCount, revealedCount: game.revealedIndices.length, allMines: game.mineIndices },
  });

  revalidatePath('/casino');

  return {
    success: true,
    payout: payoutAmount,
    multiplier: currentMultiplier,
    mineIndices: game.mineIndices,
  };
}
