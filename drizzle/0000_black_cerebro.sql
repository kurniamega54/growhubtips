CREATE TYPE "public"."comment_status" AS ENUM('pending', 'approved', 'spam', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."light_level" AS ENUM('low', 'medium', 'high', 'full_sun');--> statement-breakpoint
CREATE TYPE "public"."newsletter_status" AS ENUM('pending', 'verified', 'unsubscribed');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'published', 'scheduled', 'archived');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'author', 'admin', 'super_admin');--> statement-breakpoint
CREATE TABLE "authors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"bio" text,
	"expert_credentials" text,
	"social_links" jsonb,
	"reputation_score" numeric(5, 2) DEFAULT '0',
	"profile_image_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "authors_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "authors_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"meta_title" varchar(70),
	"meta_description" varchar(160),
	"parent_id" uuid,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"author_id" uuid,
	"parent_id" uuid,
	"author_name" varchar(255),
	"author_email" varchar(255),
	"content" text NOT NULL,
	"status" "comment_status" DEFAULT 'pending' NOT NULL,
	"user_agent" varchar(512),
	"ip_hash" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_library" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" varchar(512) NOT NULL,
	"alt_text" varchar(255),
	"title" varchar(255),
	"width" integer,
	"height" integer,
	"file_size_bytes" integer,
	"mime_type" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"source_post_id" uuid,
	"status" "newsletter_status" DEFAULT 'pending' NOT NULL,
	"verified_at" timestamp with time zone,
	"unsubscribed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "plant_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"scientific_name" varchar(255) NOT NULL,
	"common_names" jsonb DEFAULT '[]'::jsonb,
	"growth_rate" varchar(50),
	"lifespan" varchar(100),
	"light_level" "light_level",
	"watering_frequency" varchar(255),
	"soil_type" varchar(255),
	"humidity_needs" varchar(100),
	"ph_min" numeric(3, 1),
	"ph_max" numeric(3, 1),
	"is_toxic_to_pets" boolean DEFAULT false,
	"toxicity_details" text,
	"hardiness_zones" jsonb DEFAULT '[]'::jsonb,
	"heat_tolerance" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "plant_profiles_post_id_unique" UNIQUE("post_id")
);
--> statement-breakpoint
CREATE TABLE "post_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"views" integer DEFAULT 0,
	"unique_visitors" integer DEFAULT 0,
	"avg_time_on_page_seconds" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"category_id" uuid,
	"sub_category_id" uuid,
	"title" varchar(500) NOT NULL,
	"slug" varchar(500) NOT NULL,
	"excerpt" text,
	"content" text,
	"content_json" jsonb,
	"featured_image_id" uuid,
	"reading_time_minutes" integer DEFAULT 5,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"scheduled_for" timestamp with time zone,
	"last_saved" timestamp with time zone,
	"view_count" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts_to_tags" (
	"post_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "posts_to_tags_post_id_tag_id_pk" PRIMARY KEY("post_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "seo_metadata" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"focus_keyword" varchar(255),
	"seo_title" varchar(70),
	"meta_description" varchar(160),
	"canonical_url" varchar(512),
	"robots_index" boolean DEFAULT true,
	"robots_follow" boolean DEFAULT true,
	"og_image" varchar(512),
	"og_title" varchar(100),
	"og_description" varchar(200),
	"twitter_card_type" varchar(50) DEFAULT 'summary_large_image',
	"schema_json" jsonb,
	"keyword_density" real,
	"title_score" integer,
	"seo_score" integer,
	"internal_link_count" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "seo_metadata_post_id_unique" UNIQUE("post_id")
);
--> statement-breakpoint
CREATE TABLE "sub_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255),
	"name" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"avatar_url" varchar(512),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "authors" ADD CONSTRAINT "authors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ADD CONSTRAINT "newsletter_subscribers_source_post_id_posts_id_fk" FOREIGN KEY ("source_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plant_profiles" ADD CONSTRAINT "plant_profiles_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_analytics" ADD CONSTRAINT "post_analytics_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_sub_category_id_sub_categories_id_fk" FOREIGN KEY ("sub_category_id") REFERENCES "public"."sub_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_featured_image_id_media_library_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media_library"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts_to_tags" ADD CONSTRAINT "posts_to_tags_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts_to_tags" ADD CONSTRAINT "posts_to_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_authors_slug" ON "authors" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_authors_user_id" ON "authors" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_categories_slug" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_categories_parent" ON "categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "idx_comments_post" ON "comments" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "idx_comments_parent" ON "comments" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "idx_comments_status" ON "comments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_media_url" ON "media_library" USING btree ("url");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_newsletter_email" ON "newsletter_subscribers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_newsletter_status" ON "newsletter_subscribers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_newsletter_source" ON "newsletter_subscribers" USING btree ("source_post_id");--> statement-breakpoint
CREATE INDEX "idx_plant_post" ON "plant_profiles" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "idx_plant_scientific" ON "plant_profiles" USING btree ("scientific_name");--> statement-breakpoint
CREATE INDEX "idx_plant_toxic" ON "plant_profiles" USING btree ("is_toxic_to_pets");--> statement-breakpoint
CREATE INDEX "idx_plant_common_names" ON "plant_profiles" USING btree ("common_names");--> statement-breakpoint
CREATE INDEX "idx_plant_hardiness" ON "plant_profiles" USING btree ("hardiness_zones");--> statement-breakpoint
CREATE INDEX "idx_post_analytics_post" ON "post_analytics" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "idx_post_analytics_date" ON "post_analytics" USING btree ("date");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_post_analytics_post_date" ON "post_analytics" USING btree ("post_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_posts_slug" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_posts_author" ON "posts" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "idx_posts_category" ON "posts" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_posts_status" ON "posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_posts_published" ON "posts" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "idx_posts_status_published" ON "posts" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "idx_posts_tags_post" ON "posts_to_tags" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "idx_posts_tags_tag" ON "posts_to_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "idx_seo_post" ON "seo_metadata" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "idx_seo_focus_keyword" ON "seo_metadata" USING btree ("focus_keyword");--> statement-breakpoint
CREATE INDEX "idx_seo_schema" ON "seo_metadata" USING btree ("schema_json");--> statement-breakpoint
CREATE INDEX "idx_sub_categories_category" ON "sub_categories" USING btree ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_sub_categories_slug_category" ON "sub_categories" USING btree ("slug","category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_tags_slug" ON "tags" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_users_role" ON "users" USING btree ("role");