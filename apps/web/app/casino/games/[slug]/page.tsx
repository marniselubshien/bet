import { db } from "@/db";
import { games } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { DiceGame } from "@/features/games/dice/components/dice-game";
import { MinesGame } from "@/features/games/mines/components/mines-game";
import { LimboGame } from "@/features/games/limbo/components/limbo-game";
import { CoinflipGame } from "@/features/games/coinflip/components/coinflip-game";
import { PlinkoGame } from "@/features/games/plinko/components/plinko-game";
import { CrashGame } from "@/features/games/crash/components/crash-game";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Headphones } from "lucide-react";

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let gameData = await db.query.games.findFirst({
    where: eq(games.slug, slug)
  });

  if (!gameData) {
    // Fallback if not found in db yet
    const fallbackNames: Record<string, { name: string; description: string }> = {
      dice: { name: "Dice", description: "Classic Stake dice roll game. Choose your multiplier and roll to win." },
      mines: { name: "Mines", description: "Uncover gems and avoid hidden mines. Cash out at any time with high multipliers!" },
      limbo: { name: "Limbo", description: "Aim for high multipliers up to 1,000,000x. Beat the target to win." },
      coinflip: { name: "Coin Flip", description: "Pick Heads or Tails. 50/50 classic wager with instant payouts." },
      plinko: { name: "Plinko", description: "Drop the ball through the pin pyramid into multiplier pockets." },
      crash: { name: "Crash", description: "Watch the multiplier skyrocket. Cash out before the rocket crashes!" },
    };

    if (fallbackNames[slug]) {
      gameData = {
        slug,
        name: fallbackNames[slug].name,
        description: fallbackNames[slug].description,
        categoryId: "originals",
        imageKey: null,
        isActive: 1,
      };
    } else {
      notFound();
    }
  }

  const renderGame = () => {
    switch (slug) {
      case 'dice':
        return <DiceGame gameId={slug} />;
      case 'mines':
        return <MinesGame gameId={slug} />;
      case 'limbo':
        return <LimboGame gameId={slug} />;
      case 'coinflip':
        return <CoinflipGame gameId={slug} />;
      case 'plinko':
        return <PlinkoGame gameId={slug} />;
      case 'crash':
        return <CrashGame gameId={slug} />;
      default:
        return (
          <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl bg-[#213743] p-8 text-center border-none shadow-md">
            <h2 className="text-2xl font-black text-white">Coming Soon</h2>
            <p className="mt-2 text-[#8596A5] max-w-md">
              The {gameData.name} game is currently being polished. In the meantime, try playing <Link href="/casino/games/dice" className="text-[#1475E1] underline">Dice</Link>, <Link href="/casino/games/mines" className="text-[#1475E1] underline">Mines</Link>, or <Link href="/casino/games/limbo" className="text-[#1475E1] underline">Limbo</Link>!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="px-2 sm:px-4 md:px-6 py-4 max-w-[1240px] mx-auto flex flex-col gap-4">
      {/* Primary Game Canvas */}
      <div className="w-full flex justify-center">
        {renderGame()}
      </div>

      {/* Stake Bottom Sub-tabs (matching reference image) */}
      <div className="flex items-center gap-2 mt-1 select-none">
        <button type="button" className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#213743] hover:bg-[#2F4553] text-white text-xs font-bold transition-colors cursor-pointer border-none shadow-sm">
          <span>Stake Originals</span>
          <span className="text-[10px] text-[#8596A5]">▾</span>
        </button>
        <button type="button" className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#213743] hover:bg-[#2F4553] text-[#B1BAD3] hover:text-white text-xs font-bold transition-colors cursor-pointer border-none shadow-sm">
          <span>Games For You</span>
          <span className="text-[10px] text-[#8596A5]">▾</span>
        </button>
      </div>

      {/* Floating Headset Support Icon (Bottom Right, matching reference) */}
      <div className="fixed bottom-5 right-5 z-50 w-10 h-10 rounded-full bg-[#213743] hover:bg-[#2a4555] flex items-center justify-center text-white shadow-2xl cursor-pointer transition-transform hover:scale-105 border-none">
        <Headphones className="w-4 h-4 text-[#B1BAD3]" />
      </div>
    </div>
  );
}
