import { adminId } from "@/lib/admin"
import { db } from "@/db"
import { profiles, games, bets } from "@/db/schema"
import { sql } from "drizzle-orm"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  await adminId()
  const [usersCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(profiles)
  const [gamesCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(games)
  const [betsCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(bets)

  return (
    <div>
      <h1 className="mb-8 text-3xl font-black">Dashboard Overview</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-bold text-sidebar-foreground">Total Users</h3>
          <p className="mt-2 text-4xl font-black">{usersCount?.count ?? 0}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-bold text-sidebar-foreground">Total Games</h3>
          <p className="mt-2 text-4xl font-black">{gamesCount?.count ?? 0}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-bold text-sidebar-foreground">
            Total Bets Placed
          </h3>
          <p className="mt-2 text-4xl font-black">{betsCount?.count ?? 0}</p>
        </div>
      </div>
    </div>
  )
}
