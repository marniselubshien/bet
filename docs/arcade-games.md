# Added arcade games

Chicken, Pump, Dragon Tower, Slides, and Darts are registered server engines and player routes. Their original artwork is in `apps/web/public/games/*.svg`.

Run `pnpm games:add-arcade` to add their catalog records to the configured database. This inserts missing entries only; existing game statuses, limits, and balances are preserved. New entries are enabled with the standard limits. The five entries have been added to the current configured database.

Chicken and Pump have eight sequential steps with 75% survival per step. Dragon Tower has eight levels, four choices per level, and one hidden trap per level. Successful steps unlock cashout; completing level eight settles automatically. Their payout is `floor(0.99 / 0.75^step * 1e6) / 1e6`. Traps are generated on the server at round creation, never returned during active play. The existing profile-row transaction lock serializes round starts. Actions lock the round, and step-indexed reveal requests cannot advance a round twice. Existing rounds remain playable while new bets are paused.

Slides has twenty equally likely payout positions. Darts uses eight weighted rings. Both payout tables are published in the UI rules and have a theoretical 99% return before cent rounding. These are original implementations, not integrations with third-party games.

All wagers use the existing server wallet limits, account restrictions, request idempotency, settlement ledger, and admin refunds. No client result determines a payout.

Pure engine checks:

```sh
node --import tsx --test packages/casino/tests/arcade.test.ts packages/casino/tests/wheel-keno.test.ts packages/casino/tests/plinko.test.ts
```

Live wagers have not been exercised. Database integration fixtures require an isolated `CASINO_TEST_DATABASE_URL`; do not point them at the application database.
