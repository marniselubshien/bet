import { db } from "@/db";
import { profiles, games, bets, payments } from "@/db/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [usersCount] = await db.select({ count: sql<number>`count(*)` }).from(profiles);
  const [gamesCount] = await db.select({ count: sql<number>`count(*)` }).from(games);
  const [betsCount] = await db.select({ count: sql<number>`count(*)` }).from(bets);

  return (
    <div>
      <h1 className="text-3xl font-black mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-xl">
          <h3 className="text-sidebar-foreground font-bold">Total Users</h3>
          <p className="text-4xl font-black mt-2">{usersCount?.count ?? 0}</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl">
          <h3 className="text-sidebar-foreground font-bold">Total Games</h3>
          <p className="text-4xl font-black mt-2">{gamesCount?.count ?? 0}</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl">
          <h3 className="text-sidebar-foreground font-bold">Total Bets Placed</h3>
          <p className="text-4xl font-black mt-2">{betsCount?.count ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
