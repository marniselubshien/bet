import { Pool } from "pg"
import { ARCADE_GAMES } from "../src/catalog.ts"
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 15000,
})
const client = await pool.connect()
try {
  await client.query("BEGIN")
  await client.query(
    "INSERT INTO categories(id,name,slug) VALUES ('originals','7X PASA Originals','stake-originals') ON CONFLICT DO NOTHING"
  )
  for (const game of ARCADE_GAMES) {
    await client.query(
      "INSERT INTO games(slug,name,description,category_id,image_key,status,is_active,visible,min_bet_cents,max_bet_cents,max_payout_cents) VALUES($1,$2,$3,'originals',$4,'enabled',1,true,100,100000,100000000) ON CONFLICT(slug) DO NOTHING",
      [
        game.slug,
        game.name,
        game.description,
        `/games/${game.slug}.png`,
      ]
    )
  }
  await client.query("COMMIT")
  const { rows } = await client.query(
    "SELECT slug,status,is_active FROM games WHERE slug=ANY($1::text[]) ORDER BY slug",
    [ARCADE_GAMES.map((g) => g.slug)]
  )
  console.log(JSON.stringify(rows))
} catch (error) {
  await client.query("ROLLBACK")
  throw error
} finally {
  client.release()
  await pool.end()
}
