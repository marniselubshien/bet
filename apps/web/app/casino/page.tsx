import CasinoLobby, { type CategoryId } from "@/features/casino-lobby"
import { catalog, recentWins } from "@workspace/casino/platform"
import { isEngine } from "@workspace/casino/catalog"
export const dynamic = "force-dynamic"
export default async function CasinoPage() {
  const [entries, wins] = await Promise.all([catalog(), recentWins()])
  const categoryMap: Record<string, CategoryId> = {
    originals: "originals",
    arcade: "mini-games",
    slots: "slots",
    "pasa-picks": "pasa-picks",
    "mini-games": "mini-games",
    "live-casino": "live-casino",
  }
  const games = entries.map((g) => ({
    slug: g.slug,
    name: g.name,
    playing: "",
    image: g.image_key || `/games/${g.slug}.png`,
    bgGradient: "from-slate-800 to-slate-900",
    hasTextInImage: true,
    isPlayable:
      isEngine(g.slug) &&
      g.status === "enabled" &&
      g.is_active === 1 &&
      !g.betting_paused,
    categories: [categoryMap[g.category_id] ?? "originals"],
  }))
  return <CasinoLobby games={games} wins={wins} />
}
