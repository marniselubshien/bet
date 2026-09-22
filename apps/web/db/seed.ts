import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function seed() {
  console.log('Seeding categories and games...');

  await sql`
    INSERT INTO categories (id, name, slug)
    VALUES 
      ('originals', 'Stake Originals', 'stake-originals'),
      ('arcade', 'Arcade & Table', 'arcade')
    ON CONFLICT (slug) DO NOTHING;
  `;

  const games = [
    { slug: 'dice', name: 'Dice', description: 'Classic Stake dice roll game. Choose your multiplier and roll to win.', cat: 'originals' },
    { slug: 'mines', name: 'Mines', description: 'Uncover gems and avoid hidden mines. Cash out at any time with high multipliers!', cat: 'originals' },
    { slug: 'limbo', name: 'Limbo', description: 'Aim for high multipliers up to 1,000,000x. Beat the target to win.', cat: 'originals' },
    { slug: 'coinflip', name: 'Coin Flip', description: 'Pick Heads or Tails. 50/50 classic wager with instant payouts.', cat: 'originals' },
    { slug: 'plinko', name: 'Plinko', description: 'Drop the ball through the pin pyramid into multiplier pockets.', cat: 'originals' },
    { slug: 'crash', name: 'Crash', description: 'Watch the multiplier skyrocket. Cash out before the rocket crashes!', cat: 'originals' },
    { slug: 'wheel', name: 'Wheel', description: 'Spin the fortune wheel with customizable risk and win multipliers.', cat: 'originals' },
    { slug: 'keno', name: 'Keno', description: 'Select your lucky numbers and match the draw for massive returns.', cat: 'originals' }
  ];

  for (const g of games) {
    await sql`
      INSERT INTO games (slug, name, description, category_id, is_active)
      VALUES (${g.slug}, ${g.name}, ${g.description}, ${g.cat}, 1)
      ON CONFLICT (slug) DO UPDATE 
      SET name = EXCLUDED.name, description = EXCLUDED.description, is_active = 1;
    `;
  }

  console.log('Seeded games successfully!');
  const all = await sql.query('SELECT slug, name, category_id FROM games;');
  console.log('Games count in db:', all.length);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
