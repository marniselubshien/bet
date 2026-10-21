CREATE UNIQUE INDEX "game_config_unique" ON "game_config_versions" USING btree ("game_slug","version");--> statement-breakpoint
CREATE UNIQUE INDEX "round_request_unique" ON "game_rounds" USING btree ("user_id","request_id");--> statement-breakpoint
CREATE UNIQUE INDEX "one_active_session" ON "game_rounds" USING btree ("user_id","game_slug") WHERE "game_rounds"."status" = 'active' AND "game_rounds"."game_slug" IN ('mines','crash');--> statement-breakpoint
CREATE INDEX "restrictions_user_idx" ON "user_game_restrictions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "wallet_round_kind_unique" ON "wallet_entries" USING btree ("round_id","kind");--> statement-breakpoint
ALTER TABLE "game_rounds" ADD CONSTRAINT "round_stake_positive" CHECK ("game_rounds"."stake_cents" > 0);--> statement-breakpoint
ALTER TABLE "game_rounds" ADD CONSTRAINT "round_status" CHECK ("game_rounds"."status" IN ('active','settled'));--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "game_limits" CHECK ("games"."min_bet_cents" > 0 AND "games"."max_bet_cents" >= "games"."min_bet_cents" AND "games"."max_payout_cents" >= "games"."max_bet_cents");--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "game_status" CHECK ("games"."status" IN ('draft','enabled','paused','maintenance','retired'));--> statement-breakpoint
ALTER TABLE "wallet_entries" ADD CONSTRAINT "wallet_kind" CHECK ("wallet_entries"."kind" IN ('stake','payout'));
--> statement-breakpoint
INSERT INTO casino_settings(id,betting_paused) VALUES (1,false) ON CONFLICT DO NOTHING;
--> statement-breakpoint
UPDATE games SET status = CASE WHEN is_active = 1 AND slug IN ('dice','limbo','coinflip','plinko','mines','crash') THEN 'enabled' ELSE 'draft' END;
--> statement-breakpoint
INSERT INTO game_config_versions(game_slug,version,config) SELECT slug,config_version,to_jsonb(games) FROM games ON CONFLICT DO NOTHING;
