DROP INDEX "organization_slug_unique";--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `apiKey` ALTER COLUMN "enabled" TO "enabled" integer DEFAULT true;--> statement-breakpoint
CREATE UNIQUE INDEX `organization_slug_unique` ON `organization` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `apiKey` ALTER COLUMN "rate_limit_enabled" TO "rate_limit_enabled" integer DEFAULT true;--> statement-breakpoint
ALTER TABLE `apiKey` ALTER COLUMN "rate_limit_time_window" TO "rate_limit_time_window" integer DEFAULT 86400000;--> statement-breakpoint
ALTER TABLE `apiKey` ALTER COLUMN "rate_limit_max" TO "rate_limit_max" integer DEFAULT 10;--> statement-breakpoint
ALTER TABLE `apiKey` ALTER COLUMN "request_count" TO "request_count" integer;