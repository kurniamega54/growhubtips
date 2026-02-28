CREATE TYPE "public"."keyword_strategy_status" AS ENUM('draft', 'researching', 'published');--> statement-breakpoint
CREATE TYPE "public"."page_content_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "contact_form_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"subject" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"type" varchar(50) DEFAULT 'general',
	"priority" varchar(50) DEFAULT 'normal',
	"status" varchar(50) DEFAULT 'received',
	"ip_address" varchar(45),
	"user_agent" varchar(512),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faq_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"question" varchar(500) NOT NULL,
	"answer" text NOT NULL,
	"category" varchar(100),
	"sort_order" integer DEFAULT 0,
	"is_published" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "keyword_strategy" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"keyword" varchar(512) NOT NULL,
	"gsc_impressions" integer DEFAULT 0 NOT NULL,
	"gsc_clicks" integer DEFAULT 0 NOT NULL,
	"gsc_position" real DEFAULT 0 NOT NULL,
	"google_ads_cpc" numeric(10, 4) DEFAULT '0',
	"competition_level" varchar(50),
	"trending_status" boolean DEFAULT false NOT NULL,
	"generated_title" varchar(512),
	"storm_article_url" varchar(1024),
	"status" "keyword_strategy_status" DEFAULT 'draft' NOT NULL,
	"scheduled_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" varchar(1024) NOT NULL,
	"key" varchar(512) NOT NULL,
	"name" varchar(512) NOT NULL,
	"file_type" varchar(128),
	"file_size" integer,
	"width" integer,
	"height" integer,
	"alt_text" varchar(512),
	"caption" text,
	"title" varchar(512),
	"focus_keyword_relevance" real,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "office_hours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" varchar(5) NOT NULL,
	"end_time" varchar(5) NOT NULL,
	"is_open" boolean DEFAULT true,
	"timezone" varchar(50) DEFAULT 'UTC',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"meta_description" varchar(160),
	"hero_title" varchar(255),
	"hero_subtitle" text,
	"hero_image" varchar(512),
	"content" jsonb,
	"sections" jsonb,
	"status" "page_content_status" DEFAULT 'published' NOT NULL,
	"published_at" timestamp with time zone,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "page_content_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"author_id" uuid,
	"name" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	"bio" text,
	"credentials" text,
	"expertise" jsonb,
	"image_url" varchar(512),
	"social_links" jsonb,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "timeline_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"year" integer NOT NULL,
	"month" integer,
	"title" varchar(255) NOT NULL,
	"description" text,
	"icon" varchar(50),
	"image_url" varchar(512),
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_featured_image_id_media_library_id_fk";
--> statement-breakpoint
ALTER TABLE "faq_items" ADD CONSTRAINT "faq_items_page_id_page_content_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."page_content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_content" ADD CONSTRAINT "page_content_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_page_id_page_content_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."page_content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timeline_events" ADD CONSTRAINT "timeline_events_page_id_page_content_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."page_content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_contact_email" ON "contact_form_submissions" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_contact_status" ON "contact_form_submissions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_contact_type" ON "contact_form_submissions" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_contact_created" ON "contact_form_submissions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_faq_page" ON "faq_items" USING btree ("page_id");--> statement-breakpoint
CREATE INDEX "idx_faq_category" ON "faq_items" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_keyword_keyword" ON "keyword_strategy" USING btree ("keyword");--> statement-breakpoint
CREATE INDEX "idx_keyword_status" ON "keyword_strategy" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_keyword_scheduled" ON "keyword_strategy" USING btree ("scheduled_date");--> statement-breakpoint
CREATE INDEX "idx_media_key" ON "media" USING btree ("key");--> statement-breakpoint
CREATE INDEX "idx_media_name" ON "media" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_office_hours_day" ON "office_hours" USING btree ("day_of_week");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_page_content_slug" ON "page_content" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_page_content_status" ON "page_content" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_team_page" ON "team_members" USING btree ("page_id");--> statement-breakpoint
CREATE INDEX "idx_team_author" ON "team_members" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "idx_timeline_page" ON "timeline_events" USING btree ("page_id");--> statement-breakpoint
CREATE INDEX "idx_timeline_year" ON "timeline_events" USING btree ("year");--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;