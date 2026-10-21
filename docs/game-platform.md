# Game platform

## Ownership and structure

- `packages/casino/src/games/`: manually written game rules. Dice, Limbo, Coinflip and Plinko have independent engines. Mines has its own board and multiplier logic. Add a deployed implementation to the explicit registry before an administrator can enable it.
- `packages/casino/src/platform.ts`: server-only admission, transaction boundaries, persistent rounds, wallet movements, settlement and admin commands. Engines never write balances.
- `packages/casino/src/schema.ts`: canonical schema shared by both applications.
- `apps/web/features/games/`: game-specific UI and thin authenticated server actions.
- `apps/admin/app/(protected)/`: protected dashboard, catalog controls, restrictions and round recovery.
- `apps/web/drizzle/`: the only active migration history. Admin's Drizzle configuration uses this output directory as well. Its older migration copies are historical, not an independent migration stream.

## Operations

Run from the repository root:

```powershell
pnpm db:migrate
pnpm admin:grant --user-id <authenticated-user-id>
pnpm --filter admin dev
```

For a pre-existing database originally created without a Drizzle journal, review the schema first, then run `pnpm db:migrate --baseline-existing`. This explicitly validates existing column names, types and nullability against snapshot 0001, records the two historical migrations, and applies new migrations in one transaction. A mismatch aborts everything. New databases replay the complete history. Prefer a direct connection string for migrations.

The admin application defaults to port 3101 (`http://localhost:3101`) to avoid conflicts with other local apps on port 3001. Sign in using the same Neon Auth instance, with a user explicitly present in `casino_admins`. No arbitrary signed-in account receives admin access.

Admin routes:

- `/games`: global betting pause; per-game draft/enabled/paused/maintenance/retired status; lobby visibility; name, description, local image path, category and display order; minimum/maximum stake and maximum payout. Publishing archives the prior configuration and saves the new version.
- `/users`: restrict an entire player account or one game; remove a restriction with a reason.
- `/rounds`: inspect recent rounds and refund an interrupted active round once. Refunds close the round and create wallet, bet, event and admin-audit records atomically.

Every mutation independently authenticates and authorizes the administrator. Reasons are required and changes are audited. Only operator access to the database/CLI can bootstrap another administrator; no public sign-up path grants that privilege.

## Consistency contract

A new wager authenticates, validates finite inputs, claims a user-scoped idempotency key, checks platform/game status and player restrictions, locks the wallet, then creates its round and stake movement. Instant games also settle inside that transaction. Stateful games persist their private state and settle later under a round row lock. Debit, result, payout, bet history and events either commit together or roll back.

The client retains a request key after an uncertain response. Replaying that key returns the original result; changing its payload is rejected. Unique indexes enforce one request per player, one active Mines/Crash round per player/game, one configuration per version, and one stake/payout movement per round.

Admission takes shared locks on platform/game settings and a wallet row lock. Admin status changes take conflicting locks. A pause takes effect at its transaction commit: wagers already admitted may finish; subsequent wagers are rejected. Restriction creation uses the same wallet lock as admission. Missing platform/game configuration fails closed. Catalog visibility does not grant permission to bet.

Pauses/restrictions block **new** rounds. Existing rounds can finish or cash out. Existing rounds retain their original stake, engine/configuration versions, hidden state and payout ceiling. Changing limits does not rewrite a running round. Unknown game slugs cannot load executable code.

Wallet amounts use integer minor units at the service boundary and Postgres numeric balances. Payouts round down to a minor unit. Multipliers are versioned engine rules. The wallet currency is currently INR; adding currencies requires separate currency-denominated accounts rather than reusing one balance.

## Game behavior

- Dice, Limbo, Coinflip and Plinko resolve on the server before animation.
- Mines persists its private board and revealed positions in Postgres. It resumes after reload/restart; another start cannot replace an active paid round. Duplicate reveals are harmless and settlement is idempotent. Only settled rounds disclose the board.
- Crash is a **single-player** authoritative timed round. The server keeps the crash point private, computes elapsed-time multipliers, and applies the original auto-cashout. Browser polls/cashout requests can trigger settlement but cannot choose a result, stake or payout. Overdue rounds settle on the next poll/cashout after reconnect. This is not a shared multiplayer round engine or a continuously running worker.
- Randomness uses Node's cryptographic generator and unbiased Mines shuffling. The unsupported Provably Fair badge was removed. Seed commitments, rotation and a public verifier are not implemented; do not advertise provable fairness yet.
- Limbo now uses the intended inverse-tail distribution instead of the old formula capped below 99x. Plinko's existing table is retained: with ten independent 50/50 steps, its theoretical RTP is 92.421875%, not 99%. Changing payout rules should introduce an engine version and a verified math specification.

## Extending a game

1. Write a pure game module under `src/games/`; validate every option and use trusted randomness.
2. Add it to the explicit registry. Add UI separately under `apps/web/features/games/`.
3. Create a catalog row in draft status through a reviewed seed/migration. Seeds never re-enable existing games.
4. Add tests for the actual distribution/payout table, input boundaries, replay and round transitions.
5. Publish approved limits and enable the deployed game in admin. For future engine updates, retain old version handlers until all their active rounds have settled.

## Validation

Integration tests write synthetic users and admin records. Run only against an isolated migrated Neon branch, never production:

```powershell
$env:CASINO_TEST_DATABASE_URL = '<isolated-test-branch-url>'
pnpm test:casino
```

Tests cover replay, overspending, rollback, ownership, restrictions, pauses, persistent Mines, duplicate reveals/cashouts, Crash authority, refunds and invalid configuration. A temporary validation branch was created for this change and expires automatically on 2026-10-23 at 12:00 UTC.

## Deliberate boundaries

`wallet_entries` journals game movements; it is not a complete double-entry payment ledger. Existing balances and payment/bonus UI are not migrated into a new deposit/withdrawal accounting system. The casino header now reflects revalidated server balances and no longer fabricates balance increases.

Future production work includes a balanced accounting ledger and reconciliation, granular admin roles/MFA, provable-fairness verification, formally reviewed game math, rate limits and operational alerts, and a dedicated shared Crash worker if multiplayer is desired. Existing wallet/history/promotion pages elsewhere in the repository still contain prototype content.
