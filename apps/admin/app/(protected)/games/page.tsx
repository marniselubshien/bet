import { adminSnapshot } from "@workspace/casino/platform"
import { adminId } from "@/lib/admin"
import { updateGame, updatePlatform, updatePriorities } from "./actions"
import { GameEditor, EditForm } from "./game-editor"
export const dynamic = "force-dynamic"
const field = "rounded-lg border border-border bg-background px-3 py-2 text-sm"
export default async function GamesAdmin() {
  const data = await adminSnapshot(await adminId())
  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold tracking-tight">Games</h1><p className="mt-2 text-sm text-muted-foreground">{data.games.length} games · Listed in homepage order. Select Edit to manage a game.</p></div>
      <details className="rounded-xl border p-4"><summary className="cursor-pointer font-semibold">Arrange game priorities</summary><form action={updatePriorities} className="space-y-4 rounded border p-4">
        <div><h2 className="text-xl font-semibold">Game priority</h2><p className="text-sm text-muted-foreground">Lower numbers appear first on the homepage. Equal priorities sort by name. Save to update the order below.</p></div>
        <div className="space-y-2">{data.games.map((g, index) => <div key={g.slug} className="flex items-center gap-4 border-b py-2">
          <span className="w-6 text-sm text-muted-foreground">{index + 1}</span>
          <span className="flex-1">{g.name}{!g.visible && <small className="ml-2 text-muted-foreground">Hidden</small>}</span>
          <input type="hidden" name="slug" value={g.slug}/>
          <input className={`${field} w-24`} type="number" name={`priority:${g.slug}`} defaultValue={g.sort_order} min={-100000} max={100000} step={1} required aria-label={`${g.name} priority`}/>
        </div>)}</div>
        <button className={field}>Save priorities</button>
      </form></details>
      <form
        action={updatePlatform}
        className="flex flex-wrap items-center gap-3 rounded border p-4"
      >
        <strong>
          Platform:{" "}
          {data.settings?.betting_paused ? "Betting paused" : "Betting enabled"}
        </strong>
        <input
          type="hidden"
          name="paused"
          value={data.settings?.betting_paused ? "false" : "true"}
        />
        <input
          className={field}
          name="reason"
          required
          maxLength={500}
          placeholder="Reason for change"
          aria-label="Platform change reason"
        />
        <button className={field}>
          {data.settings?.betting_paused
            ? "Resume betting"
            : "Pause all new bets"}
        </button>
      </form>
      <p>
        Pauses stop new bets. Existing rounds remain available for completion.
        Limits use the current wallet currency (INR).
      </p>
      <div className="space-y-3">{data.games.map((g) => (
        <GameEditor key={`${g.slug}-${g.config_version}-${g.sort_order}`} name={g.name} image={g.image_key || `/games/${g.slug}.png`} status={g.status} priority={g.sort_order} visible={g.visible}><EditForm
          key={g.slug}
          action={updateGame}
          className="space-y-5"
        >
          <h2 className="text-xl font-semibold">
            {g.name} <span className="text-sm">version {g.config_version}</span>
          </h2>
          <input type="hidden" name="slug" value={g.slug} />
          <div className="grid gap-4 sm:grid-cols-2 [&>label]:flex [&>label]:flex-col [&>label]:gap-2 [&>label]:text-sm">
            <label>
              Name{" "}
              <input
                className={field}
                name="name"
                defaultValue={g.name}
                required
                maxLength={100}
              />
            </label>
            <label>
              Description{" "}
              <input
                className={field}
                name="description"
                defaultValue={g.description || ""}
                maxLength={1000}
              />
            </label>
            <label>
              Image path{" "}
              <input
                className={field}
                name="image"
                defaultValue={g.image_key || `/games/${g.slug}.png`}
              />
            </label>
            <label>
              Priority{" "}
              <input
                className={field}
                type="number"
                name="sortOrder"
                defaultValue={g.sort_order}
                required
              />
            </label>
            <label>
              Category{" "}
              <select
                className={field}
                name="categoryId"
                defaultValue={g.category_id || ""}
              >
                <option value="">Uncategorized</option>
                {data.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Status{" "}
              <select className={field} name="status" defaultValue={g.status}>
                {["draft", "enabled", "paused", "maintenance", "retired"].map(
                  (s) => (
                    <option key={s}>{s}</option>
                  )
                )}
              </select>
            </label>
            <label>
              <input
                type="checkbox"
                name="visible"
                defaultChecked={g.visible}
              />{" "}
              Show in lobby
            </label>
            <label>
              Minimum bet{" "}
              <input
                className={field}
                type="number"
                min="0.01"
                step="0.01"
                name="min"
                defaultValue={Number(g.min_bet_cents) / 100}
                required
              />
            </label>
            <label>
              Maximum bet{" "}
              <input
                className={field}
                type="number"
                min="0.01"
                step="0.01"
                name="max"
                defaultValue={Number(g.max_bet_cents) / 100}
                required
              />
            </label>
            <label>
              Maximum payout{" "}
              <input
                className={field}
                type="number"
                min="0.01"
                step="0.01"
                name="payout"
                defaultValue={Number(g.max_payout_cents) / 100}
                required
              />
            </label>
          </div>
          <input
            className={field}
            name="reason"
            required
            maxLength={500}
            placeholder="Reason for change"
            aria-label={`${g.name} change reason`}
          />{" "}
          <button className={field}>Publish settings</button>
        </EditForm></GameEditor>
      ))}</div>
      <details className="rounded-xl border p-4"><summary className="cursor-pointer font-semibold">Recent admin changes</summary>
      <ul className="space-y-2">
        {data.audits.map((a) => (
          <li key={a.id} className="rounded border p-3">
            {String(a.created_at)} Â· {a.actor_id} Â· {a.command.kind} Â·{" "}
            {a.command.reason}
          </li>
        ))}
      </ul></details>
    </div>
  )
}
