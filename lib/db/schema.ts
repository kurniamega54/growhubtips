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
import type { EditorJson } from "@/lib/types/editor";

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

// New modern `media` table for DAM (cloud-native)
export const media = pgTable(
  "media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    url: varchar("url", { length: 1024 }).notNull(),
    key: varchar("key", { length: 512 }).notNull(), // storage key in cloud provider
    name: varchar("name", { length: 512 }).notNull(),
    file_type: varchar("file_type", { length: 128 }),
    file_size: integer("file_size"),
    width: integer("width"),
    height: integer("height"),
    alt_text: varchar("alt_text", { length: 512 }),
    caption: text("caption"),
    title: varchar("title", { length: 512 }),
    focus_keyword_relevance: real("focus_keyword_relevance"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("idx_media_key").on(t.key), index("idx_media_name").on(t.name)]
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
    featuredImageId: uuid("featured_image_id").references(() => media.id, { onDelete: "set null" }),
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

// -----------------------------------------------------------------------------
// STRATEGY TABLE (Search Intelligence Engine)
// -----------------------------------------------------------------------------

export const keywordStrategyStatusEnum = pgEnum("keyword_strategy_status", [
  "draft",
  "researching",
  "published",
]);

export const keywordStrategy = pgTable(
  "keyword_strategy",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    keyword: varchar("keyword", { length: 512 }).notNull(),
    gsc_impressions: integer("gsc_impressions").default(0).notNull(),
    gsc_clicks: integer("gsc_clicks").default(0).notNull(),
    gsc_position: real("gsc_position").default(0).notNull(),
    google_ads_cpc: decimal("google_ads_cpc", { precision: 10, scale: 4 }).default("0"),
    competition_level: varchar("competition_level", { length: 50 }),
    trending_status: boolean("trending_status").default(false).notNull(),
    generated_title: varchar("generated_title", { length: 512 }),
    storm_article_url: varchar("storm_article_url", { length: 1024 }),
    status: keywordStrategyStatusEnum("status").default("draft").notNull(),
    scheduled_date: timestamp("scheduled_date", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("idx_keyword_keyword").on(t.keyword),
    index("idx_keyword_status").on(t.status),
    index("idx_keyword_scheduled").on(t.scheduled_date),
  ]
);


// =============================================================================
// 5. STATIC PAGES & CMS (Dynamic Content Management)
// =============================================================================

export const pageContentStatusEnum = pgEnum("page_content_status", ["draft", "published", "archived"]);

export const pageContent = pgTable(
  "page_content",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 255 }).notNull().unique(), // "about", "contact", "privacy", "affiliate"
    title: varchar("title", { length: 255 }).notNull(),
    metaDescription: varchar("meta_description", { length: 160 }),
    heroTitle: varchar("hero_title", { length: 255 }),
    heroSubtitle: text("hero_subtitle"),
    heroImage: varchar("hero_image", { length: 512 }),
    content: jsonb("content").$type<Record<string, unknown>>(), // Store complex content
    sections: jsonb("sections").$type<PageSection[]>(),
    status: pageContentStatusEnum("status").default("published").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("idx_page_content_slug").on(t.slug),
    index("idx_page_content_status").on(t.status),
  ]
);

export const timelineEvents = pgTable(
  "timeline_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pageId: uuid("page_id")
      .notNull()
      .references(() => pageContent.id, { onDelete: "cascade" }),
    year: integer("year").notNull(),
    month: integer("month"),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    icon: varchar("icon", { length: 50 }), // emoji or icon name
    imageUrl: varchar("image_url", { length: 512 }),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("idx_timeline_page").on(t.pageId),
    index("idx_timeline_year").on(t.year),
  ]
);

export const teamMembers = pgTable(
  "team_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pageId: uuid("page_id")
      .notNull()
      .references(() => pageContent.id, { onDelete: "cascade" }),
    authorId: uuid("author_id").references(() => authors.id, { onDelete: "set null" }),
    name: varchar("name", { length: 255 }).notNull(),
    role: varchar("role", { length: 255 }).notNull(),
    bio: text("bio"),
    credentials: text("credentials"),
    expertise: jsonb("expertise").$type<string[]>(),
    imageUrl: varchar("image_url", { length: 512 }),
    socialLinks: jsonb("social_links").$type<Record<string, string>>(),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("idx_team_page").on(t.pageId),
    index("idx_team_author").on(t.authorId),
  ]
);

export const faqItems = pgTable(
  "faq_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pageId: uuid("page_id")
      .notNull()
      .references(() => pageContent.id, { onDelete: "cascade" }),
    question: varchar("question", { length: 500 }).notNull(),
    answer: text("answer").notNull(),
    category: varchar("category", { length: 100 }),
    sortOrder: integer("sort_order").default(0),
    isPublished: boolean("is_published").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("idx_faq_page").on(t.pageId),
    index("idx_faq_category").on(t.category),
  ]
);

export const contactFormSubmissions = pgTable(
  "contact_form_submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    subject: varchar("subject", { length: 255 }).notNull(),
    message: text("message").notNull(),
    type: varchar("type", { length: 50 }).default("general"), // general, clinic, expert
    priority: varchar("priority", { length: 50 }).default("normal"), // low, normal, high
    status: varchar("status", { length: 50 }).default("received"), // received, read, responded, archived
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: varchar("user_agent", { length: 512 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("idx_contact_email").on(t.email),
    index("idx_contact_status").on(t.status),
    index("idx_contact_type").on(t.type),
    index("idx_contact_created").on(t.createdAt),
  ]
);

export const officeHours = pgTable(
  "office_hours",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
    startTime: varchar("start_time", { length: 5 }).notNull(), // "09:00"
    endTime: varchar("end_time", { length: 5 }).notNull(), // "17:00"
    isOpen: boolean("is_open").default(true),
    timezone: varchar("timezone", { length: 50 }).default("UTC"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("idx_office_hours_day").on(t.dayOfWeek)]
);

export const siteSettings = pgTable(
  "site_settings",
  {
    key: varchar("key", { length: 255 }).primaryKey(),
    value: text("value"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("idx_site_settings_key").on(t.key)]
);

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type PageSection = {
  id: string;
  type: "text" | "image" | "timeline" | "team" | "cta" | "testimonial" | "stats";
  title?: string;
  content?: string | Record<string, unknown>;
};

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
  featuredImage: one(media),
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

export const pageContentRelations = relations(pageContent, ({ one, many }) => ({
  creator: one(users),
  timelineEvents: many(timelineEvents),
  teamMembers: many(teamMembers),
  faqItems: many(faqItems),
}));

export const timelineEventsRelations = relations(timelineEvents, ({ one }) => ({
  page: one(pageContent),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  page: one(pageContent),
  author: one(authors),
}));

export const faqItemsRelations = relations(faqItems, ({ one }) => ({
  page: one(pageContent),
}));

export const contactFormSubmissionsRelations = relations(contactFormSubmissions, ({ one }) => ({}));
