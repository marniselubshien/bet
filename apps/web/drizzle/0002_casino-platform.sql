CREATE TABLE "admin_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" text NOT NULL,
	"command" jsonb NOT NULL,
	"before_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "casino_admins" (
	"user_id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "casino_settings" (
	"id" integer PRIMARY KEY NOT NULL,
	"betting_paused" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_config_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_slug" text NOT NULL,
	"version" integer NOT NULL,
	"config" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_rounds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"game_slug" text NOT NULL,
	"request_id" text NOT NULL,
	"fingerprint" text NOT NULL,
	"stake_cents" bigint NOT NULL,
	"max_payout_cents" bigint NOT NULL,
	"config_version" integer NOT NULL,
	"engine_version" integer DEFAULT 1 NOT NULL,
	"state" jsonb NOT NULL,
	"public_result" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"settled_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "user_game_restrictions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"game_slug" text,
	"reason" text NOT NULL,
	"created_by" text NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wallet_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"round_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"amount_cents" bigint NOT NULL,
	"balance_after" numeric(12, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bets" DROP CONSTRAINT "bets_user_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "bets" DROP CONSTRAINT "bets_game_slug_games_slug_fk";
--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_user_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "support_tickets" DROP CONSTRAINT "support_tickets_user_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "is_active" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "status" text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "visible" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "min_bet_cents" bigint DEFAULT 100 NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "max_bet_cents" bigint DEFAULT 100000 NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "max_payout_cents" bigint DEFAULT 100000000 NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "config_version" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "game_config_versions" ADD CONSTRAINT "game_config_versions_game_slug_games_slug_fk" FOREIGN KEY ("game_slug") REFERENCES "public"."games"("slug") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_rounds" ADD CONSTRAINT "game_rounds_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_rounds" ADD CONSTRAINT "game_rounds_game_slug_games_slug_fk" FOREIGN KEY ("game_slug") REFERENCES "public"."games"("slug") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_game_restrictions" ADD CONSTRAINT "user_game_restrictions_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_game_restrictions" ADD CONSTRAINT "user_game_restrictions_game_slug_games_slug_fk" FOREIGN KEY ("game_slug") REFERENCES "public"."games"("slug") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_entries" ADD CONSTRAINT "wallet_entries_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_entries" ADD CONSTRAINT "wallet_entries_round_id_game_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."game_rounds"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bets" ADD CONSTRAINT "bets_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bets" ADD CONSTRAINT "bets_game_slug_games_slug_fk" FOREIGN KEY ("game_slug") REFERENCES "public"."games"("slug") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;