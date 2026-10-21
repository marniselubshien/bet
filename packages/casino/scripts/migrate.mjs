import { readFile } from "node:fs/promises"
import { createHash } from "node:crypto"
import { Pool } from "pg"
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 15000,
})
const c = await pool.connect()
try {
  await c.query("BEGIN")
  await c.query("SELECT pg_advisory_xact_lock(73495021)")
  await c.query("CREATE SCHEMA IF NOT EXISTS drizzle")
  await c.query(
    "CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations(id serial PRIMARY KEY, hash text NOT NULL, created_at bigint)"
  )
  const journal = JSON.parse(
    await readFile(
      new URL("../../../apps/web/drizzle/meta/_journal.json", import.meta.url),
      "utf8"
    )
  )
  let {
    rows: [last],
  } = await c.query(
    "SELECT created_at FROM drizzle.__drizzle_migrations ORDER BY created_at DESC LIMIT 1"
  )
  const {
    rows: [existing],
  } = await c.query("SELECT to_regclass('public.profiles') AS profiles")
  if (!last && existing.profiles) {
    if (!process.argv.includes("--baseline-existing"))
      throw new Error(
        "Existing schema has no migration journal. Review the schema and run --baseline-existing to validate and baseline migrations 0000/0001."
      )
    const snapshot = JSON.parse(
      await readFile(
        new URL(
          "../../../apps/web/drizzle/meta/0001_snapshot.json",
          import.meta.url
        ),
        "utf8"
      )
    )
    const normalize = (value) =>
      value
        .replace("timestamp without time zone", "timestamp")
        .replace("timestamp with time zone", "timestamptz")
        .replaceAll(" ", "")
        .replaceAll('"', "")
    for (const table of Object.values(snapshot.tables)) {
      const { rows: columns } = await c.query(
        `SELECT a.attname AS name, format_type(a.atttypid,a.atttypmod) AS type,a.attnotnull AS not_null FROM pg_attribute a JOIN pg_class t ON a.attrelid=t.oid JOIN pg_namespace n ON t.relnamespace=n.oid WHERE n.nspname='public' AND t.relname=$1 AND a.attnum>0 AND NOT a.attisdropped`,
        [table.name]
      )
      for (const column of Object.values(table.columns)) {
        const actual = columns.find((a) => a.name === column.name)
        if (
          !actual ||
          normalize(actual.type) !== normalize(column.type) ||
          actual.not_null !== column.notNull
        )
          throw new Error(`Baseline mismatch: ${table.name}.${column.name}`)
      }
    }
    for (const entry of journal.entries.slice(0, 2)) {
      const sql = await readFile(
        new URL(`../../../apps/web/drizzle/${entry.tag}.sql`, import.meta.url),
        "utf8"
      )
      await c.query(
        "INSERT INTO drizzle.__drizzle_migrations(hash,created_at) VALUES ($1,$2)",
        [createHash("sha256").update(sql).digest("hex"), entry.when]
      )
      last = { created_at: entry.when }
    }
    console.log("Validated existing schema and baselined migrations 0000/0001")
  }
  for (const entry of journal.entries) {
    if (last && Number(last.created_at) >= entry.when) continue
    const sql = await readFile(
      new URL(`../../../apps/web/drizzle/${entry.tag}.sql`, import.meta.url),
      "utf8"
    )
    for (const statement of sql.split("--> statement-breakpoint"))
      if (statement.trim()) await c.query(statement)
    await c.query(
      "INSERT INTO drizzle.__drizzle_migrations(hash,created_at) VALUES ($1,$2)",
      [createHash("sha256").update(sql).digest("hex"), entry.when]
    )
    console.log(`Applied ${entry.tag}`)
  }
  await c.query("COMMIT")
} catch (error) {
  await c.query("ROLLBACK")
  console.error(error instanceof Error ? error.message : "Migration failed")
  process.exitCode = 1
} finally {
  c.release()
  await pool.end()
}
