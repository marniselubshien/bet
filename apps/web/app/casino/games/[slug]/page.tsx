import { ArcadeGame } from "@/features/games/arcade/arcade-game"
import { ARCADE_GAMES, isJourneyGame } from "@workspace/casino/catalog"
import { db } from "@/db"
import { games } from "@/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { DiceGame } from "@/features/games/dice/components/dice-game"
import { MinesGame } from "@/features/games/mines/components/mines-game"
import { LimboGame } from "@/features/games/limbo/components/limbo-game"
import { CoinflipGame } from "@/features/games/coinflip/components/coinflip-game"
import { PlinkoGame } from "@/features/games/plinko/components/plinko-game"
import { CrashGame } from "@/features/games/crash/components/crash-game"
import { WheelGame, KenoGame } from "@/features/games/table-games/table-game"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Badge } from "@workspace/ui/components/badge"

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const arcadeDefinition = ARCADE_GAMES.find((game) => game.slug === slug)
  let gameData = await db.query.games.findFirst({
    where: eq(games.slug, slug),
  })

  if (!gameData) notFound()
  if (gameData.status !== "enabled" || gameData.isActive !== 1) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold">
          {gameData.name} is currently unavailable
        </h1>
        <p>New bets are paused. Existing rounds can be resumed below.</p>
        {gameData.slug === "mines" ? (
          <MinesGame gameId={slug} />
        ) : gameData.slug === "crash" ? (
          <CrashGame gameId={slug} />
        ) : arcadeDefinition && isJourneyGame(slug) ? (
          <ArcadeGame slug={arcadeDefinition.slug} />
        ) : null}
      </div>
    )
  }

  const renderGame = () => {
    if (arcadeDefinition) return <ArcadeGame slug={arcadeDefinition.slug} />
    switch (slug) {
      case "wheel":
        return <WheelGame />
      case "keno":
        return <KenoGame />
      case "dice":
        return <DiceGame gameId={slug} />
      case "mines":
        return <MinesGame gameId={slug} />
      case "limbo":
        return <LimboGame gameId={slug} />
      case "coinflip":
        return <CoinflipGame gameId={slug} />
      case "plinko":
        return <PlinkoGame gameId={slug} />
      case "crash":
        return <CrashGame gameId={slug} />
      default:
        return (
          <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border-none bg-[#213743] p-8 text-center shadow-md">
            <h2 className="text-2xl font-black text-white">Coming Soon</h2>
            <p className="mt-2 max-w-md text-[#8596A5]">
              The {gameData.name} game is currently being polished. In the
              meantime, try playing{" "}
              <Link
                href="/casino/games/dice"
                className="text-[#1475E1] underline"
              >
                Dice
              </Link>
              ,{" "}
              <Link
                href="/casino/games/mines"
                className="text-[#1475E1] underline"
              >
                Mines
              </Link>
              , or{" "}
              <Link
                href="/casino/games/limbo"
                className="text-[#1475E1] underline"
              >
                Limbo
              </Link>
              !
            </p>
          </div>
        )
    }
  }

  return (
    <div className="flex w-full flex-col gap-5">
      {/* Primary Game Canvas */}
      <div className="flex w-full justify-center overflow-x-hidden">
        {renderGame()}
      </div>
    </div>
  )
}
