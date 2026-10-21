import { adminSnapshot } from "@workspace/casino/platform"
import { adminId } from "@/lib/admin"
import { refundRound } from "./actions"
export default async function RoundsPage() {
  const data = await adminSnapshot(await adminId())
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Recent rounds</h1>
      <p>
        Active rounds appear first. Refunds return the original stake once,
        close the round, and record an audit entry.
      </p>
      {data.rounds.map((r) => (
        <div key={r.id} className="space-y-2 rounded border p-4">
          <p>
            {r.game_slug} · {r.status} · INR {Number(r.stake_cents) / 100} ·
            configuration {r.config_version}
          </p>
          <p className="text-sm break-all">
            Round: {r.id}
            <br />
            Player: {r.user_id}
          </p>
          {r.status === "active" && (
            <form action={refundRound} className="flex gap-3">
              <input type="hidden" name="id" value={r.id} />
              <input
                className="rounded border p-2"
                name="reason"
                required
                maxLength={500}
                placeholder="Refund reason"
                aria-label="Refund reason"
              />
              <button className="rounded border p-2">
                Refund and close round
              </button>
            </form>
          )}
        </div>
      ))}
    </div>
  )
}
