import { adminSnapshot } from "@workspace/casino/platform"
import { adminId } from "@/lib/admin"
import { restrictPlayer, removeRestriction } from "../games/actions"
export const dynamic = "force-dynamic"
export default async function UsersAdmin() {
  const data = await adminSnapshot(await adminId())
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Player restrictions</h1>
      <p>Restrictions prevent new bets. Existing rounds can finish.</p>
      <form
        action={restrictPlayer}
        className="flex flex-wrap gap-3 rounded border p-4"
      >
        <input
          className="border p-2"
          name="userId"
          required
          placeholder="Player user ID"
          aria-label="Player user ID"
        />
        <select className="border p-2" name="slug" aria-label="Restricted game">
          <option value="">All games</option>
          {data.games.map((g) => (
            <option key={g.slug} value={g.slug}>
              {g.name}
            </option>
          ))}
        </select>
        <input
          className="border p-2"
          name="reason"
          required
          maxLength={500}
          placeholder="Reason"
          aria-label="Restriction reason"
        />
        <button className="border p-2">Restrict betting</button>
      </form>
      {data.restrictions.map((r) => (
        <form
          action={removeRestriction}
          key={r.id}
          className="flex flex-wrap items-center gap-3 rounded border p-4"
        >
          <span>
            {r.user_id} · {r.game_slug || "All games"} · {r.reason}
          </span>
          <input type="hidden" name="id" value={r.id} />
          <input
            className="border p-2"
            name="reason"
            required
            maxLength={500}
            placeholder="Reason for removal"
            aria-label="Removal reason"
          />
          <button className="border p-2">Remove restriction</button>
        </form>
      ))}
    </div>
  )
}
