/**
 * GrowHubTips - Enterprise Database Schema
 * Architecture: Lead Database Architect | Production-Ready for 1M+ visitors/month
 * Stack: Next.js 14 | PostgreSQL (Neon) | Drizzle ORM
 */

import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  decimal,
  jsonb,
  timestamp,
  real,
  primaryKey,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { EditorJson } from "@/src/types/editor";

// =============================================================================
// ENUMS - Type-safe status and classification fields
// =============================================================================

export const userRoleEnum = pgEnum("user_role", ["user", "author", "admin", "super_admin"]);
export const postStatusEnum = pgEnum("post_status", ["draft", "published", "scheduled", "archived"]);
export const commentStatusEnum = pgEnum("comment_status", ["pending", "approved", "spam", "rejected"]);
export const lightLevelEnum = pgEnum("light_level", ["low", "medium", "high", "full_sun"]);
export const newsletterStatusEnum = pgEnum("newsletter_status", ["pending", "verified", "unsubscribed"]);

// =============================================================================
// 1. CORE CONTENT ENGINE
// =============================================================================

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }),
    name: varchar("name", { length: 255 }).notNull(),
    role: userRoleEnum("role").default("user").notNull(),
    avatarUrl: varchar("avatar_url", { length: 512 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("idx_users_email").on(t.email), index("idx_users_role").on(t.role)]
);

export const authors = pgTable(
  "authors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    bio: text("bio"),
    expertCredentials: text("expert_credentials"),
    socialLinks: jsonb("social_links").$type<Record<string, string>>(),
    reputationScore: decimal("reputation_score", { precision: 5, scale: 2 }).default("0"),
    profileImageId: uuid("profile_image_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("idx_authors_slug").on(t.slug),
    index("idx_authors_user_id").on(t.userId),
  ]
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    metaTitle: varchar("meta_title", { length: 70 }),
    metaDescription: varchar("meta_description", { length: 160 }),
    parentId: uuid("parent_id"),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("idx_categories_slug").on(t.slug),
    index("idx_categories_parent").on(t.parentId),
  ]
);

export const subCategories = pgTable(
  "sub_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("idx_sub_categories_category").on(t.categoryId),
    uniqueIndex("idx_sub_categories_slug_category").on(t.slug, t.categoryId),
  ]
);

// Media must be defined before posts (FK reference)
export const mediaLibrary = pgTable(
  "media_library",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    url: varchar("url", { length: 512 }).notNull(),
    altText: varchar("alt_text", { length: 255 }),
    title: varchar("title", { length: 255 }),
    width: integer("width"),
    height: integer("height"),
    fileSizeBytes: integer("file_size_bytes"),
    mimeType: varchar("mime_type", { length: 100 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("idx_media_url").on(t.url)]
);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => authors.id, { onDelete: "restrict" }),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    subCategoryId: uuid("sub_category_id").references(() => subCategories.id, { onDelete: "set null" }),
    title: varchar("title", { length: 500 }).notNull(),
    slug: varchar("slug", { length: 500 }).notNull(),
    excerpt: text("excerpt"),
    content: text("content"),
    contentJson: jsonb("content_json").$type<EditorJson | null>(),
    featuredImageId: uuid("featured_image_id").references(() => mediaLibrary.id, { onDelete: "set null" }),
    readingTimeMinutes: integer("reading_time_minutes").default(5),
    status: postStatusEnum("status").default("draft").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
    lastSaved: timestamp("last_saved", { withTimezone: true }),
    viewCount: integer("view_count").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("idx_posts_slug").on(t.slug),
    index("idx_posts_author").on(t.authorId),
    index("idx_posts_category").on(t.categoryId),
    index("idx_posts_status").on(t.status),
    index("idx_posts_published").on(t.publishedAt),
    index("idx_posts_status_published").on(t.status, t.publishedAt),
  ]
);

export type Post = typeof posts.$inferSelect;

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("idx_tags_slug").on(t.slug)]
);

export const postsToTags = pgTable(
  "posts_to_tags",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.postId, t.tagId] }),
    index("idx_posts_tags_post").on(t.postId),
    index("idx_posts_tags_tag").on(t.tagId),
  ]
);

// =============================================================================
// 2. ADVANCED SEO ENGINE (Rank-Math Style)
// =============================================================================

export const seoMetadata = pgTable(
  "seo_metadata",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" })
      .unique(),
    focusKeyword: varchar("focus_keyword", { length: 255 }),
    seoTitle: varchar("seo_title", { length: 70 }),
    metaDescription: varchar("meta_description", { length: 160 }),
    canonicalUrl: varchar("canonical_url", { length: 512 }),
    robotsIndex: boolean("robots_index").default(true),
    robotsFollow: boolean("robots_follow").default(true),
    ogImage: varchar("og_image", { length: 512 }),
    ogTitle: varchar("og_title", { length: 100 }),
    ogDescription: varchar("og_description", { length: 200 }),
    twitterCardType: varchar("twitter_card_type", { length: 50 }).default("summary_large_image"),
    schemaJson: jsonb("schema_json").$type<Record<string, unknown> | unknown[]>(),
    keywordDensity: real("keyword_density"),
    titleScore: integer("title_score"),
    seoScore: integer("seo_score"),
    internalLinkCount: integer("internal_link_count").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("idx_seo_post").on(t.postId),
    index("idx_seo_focus_keyword").on(t.focusKeyword),
    index("idx_seo_schema").on(t.schemaJson),
  ]
);

// =============================================================================
// 3. PLANT ENCYCLOPEDIA (Niche-Specific)
// =============================================================================

export const plantProfiles = pgTable(
  "plant_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" })
      .unique(),
    scientificName: varchar("scientific_name", { length: 255 }).notNull(),
    commonNames: jsonb("common_names").$type<string[]>().default([]),
    growthRate: varchar("growth_rate", { length: 50 }),
    lifespan: varchar("lifespan", { length: 100 }),
    lightLevel: lightLevelEnum("light_level"),
    wateringFrequency: varchar("watering_frequency", { length: 255 }),
    soilType: varchar("soil_type", { length: 255 }),
    humidityNeeds: varchar("humidity_needs", { length: 100 }),
    phMin: decimal("ph_min", { precision: 3, scale: 1 }),
    phMax: decimal("ph_max", { precision: 3, scale: 1 }),
    isToxicToPets: boolean("is_toxic_to_pets").default(false),
    toxicityDetails: text("toxicity_details"),
    hardinessZones: jsonb("hardiness_zones").$type<string[]>().default([]),
    heatTolerance: varchar("heat_tolerance", { length: 100 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("idx_plant_post").on(t.postId),
    index("idx_plant_scientific").on(t.scientificName),
    index("idx_plant_toxic").on(t.isToxicToPets),
    index("idx_plant_common_names").on(t.commonNames),
    index("idx_plant_hardiness").on(t.hardinessZones),
  ]
);

// =============================================================================
// 4. ENGAGEMENT & ANALYTICS
// =============================================================================

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
    parentId: uuid("parent_id"),
    authorName: varchar("author_name", { length: 255 }),
    authorEmail: varchar("author_email", { length: 255 }),
    content: text("content").notNull(),
    status: commentStatusEnum("status").default("pending").notNull(),
    userAgent: varchar("user_agent", { length: 512 }),
    ipHash: varchar("ip_hash", { length: 64 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("idx_comments_post").on(t.postId),
    index("idx_comments_parent").on(t.parentId),
    index("idx_comments_status").on(t.status),
  ]
);

export const postAnalytics = pgTable(
  "post_analytics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    date: timestamp("date", { withTimezone: true }).notNull(),
    views: integer("views").default(0),
    uniqueVisitors: integer("unique_visitors").default(0),
    avgTimeOnPageSeconds: integer("avg_time_on_page_seconds").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("idx_post_analytics_post").on(t.postId),
    index("idx_post_analytics_date").on(t.date),
    uniqueIndex("idx_post_analytics_post_date").on(t.postId, t.date),
  ]
);

export const newsletterSubscribers = pgTable(
  "newsletter_subscribers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    sourcePostId: uuid("source_post_id").references(() => posts.id, { onDelete: "set null" }),
    status: newsletterStatusEnum("status").default("pending").notNull(),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("idx_newsletter_email").on(t.email),
    index("idx_newsletter_status").on(t.status),
    index("idx_newsletter_source").on(t.sourcePostId),
  ]
);

// =============================================================================
// RELATIONS - Drizzle relations API
// =============================================================================

export const usersRelations = relations(users, ({ one }) => ({
  author: one(authors),
}));

export const authorsRelations = relations(authors, ({ one, many }) => ({
  user: one(users),
  posts: many(posts),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, { fields: [categories.parentId], references: [categories.id] }),
  children: many(categories),
  subCategories: many(subCategories),
  posts: many(posts),
}));

export const subCategoriesRelations = relations(subCategories, ({ one, many }) => ({
  category: one(categories),
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(authors),
  category: one(categories),
  subCategory: one(subCategories),
  featuredImage: one(mediaLibrary),
  seoMetadata: one(seoMetadata),
  plantProfile: one(plantProfiles),
  tags: many(postsToTags),
  comments: many(comments),
  postAnalytics: many(postAnalytics),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  posts: many(postsToTags),
}));

export const postsToTagsRelations = relations(postsToTags, ({ one }) => ({
  post: one(posts),
  tag: one(tags),
}));

export const seoMetadataRelations = relations(seoMetadata, ({ one }) => ({
  post: one(posts),
}));

export const plantProfilesRelations = relations(plantProfiles, ({ one }) => ({
  post: one(posts),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts),
  author: one(users),
  parent: one(comments),
  replies: many(comments),
}));

export const postAnalyticsRelations = relations(postAnalytics, ({ one }) => ({
  post: one(posts),
}));

export const newsletterSubscribersRelations = relations(newsletterSubscribers, ({ one }) => ({
  sourcePost: one(posts),
}));

export const mediaLibraryRelations = relations(mediaLibrary, ({ many }) => ({
  posts: many(posts),
}));
