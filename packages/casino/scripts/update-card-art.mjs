import { Pool } from "pg"
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 15000,
})
const client = await pool.connect()
try {
  await client.query("BEGIN")
  for (const slug of [
    "darts",
    "chicken",
    "dragon-tower",
    "pump",
    "limbo",
    "slides",
    "moles",
  ]) {
    const result = await client.query(
      "UPDATE games SET image_key=$2 WHERE slug=$1 RETURNING slug,image_key",
      [slug, `/games/${slug}.png`]
    )
    if (result.rowCount) console.log(JSON.stringify(result.rows[0]))
  }
  await client.query("COMMIT")
} catch (error) {
  await client.query("ROLLBACK")
  throw error
} finally {
  client.release()
  await pool.end()
}
