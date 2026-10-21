import { Pool } from "pg"
const index = process.argv.indexOf("--user-id")
const id = index >= 0 ? process.argv[index + 1] : undefined
if (!id || id.startsWith("--"))
  throw new Error(
    "Usage: node --env-file=.env.local packages/casino/scripts/grant-admin.mjs --user-id <authenticated-user-id>"
  )
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 15000,
})
try {
  const c = await pool.connect()
  try {
    await c.query("BEGIN")
    await c.query(
      "INSERT INTO casino_admins(user_id) VALUES ($1) ON CONFLICT DO NOTHING",
      [id]
    )
    await c.query(
      "INSERT INTO admin_audit_logs(actor_id,command) VALUES ('operator-cli',$1)",
      [
        JSON.stringify({
          kind: "grant-admin",
          target: id,
          reason: "Explicit operator bootstrap",
        }),
      ]
    )
    await c.query("COMMIT")
    console.log("Administrator access granted to the supplied user ID.")
  } catch (error) {
    await c.query("ROLLBACK")
    throw error
  } finally {
    c.release()
  }
} finally {
  await pool.end()
}
