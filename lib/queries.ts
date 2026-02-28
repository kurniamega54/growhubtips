import { db } from "@/lib/db";
import { posts, categories, authors, seoMetadata } from "@/lib/db/schema";
import { eq, desc, sql, and, ne } from "drizzle-orm";

export async function getPublishedPosts(limit = 10) {
  try {
    return await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      publishedAt: posts.publishedAt,
      readingTimeMinutes: posts.readingTimeMinutes,
      viewCount: posts.viewCount,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  } catch {
    return [];
  }
}

export async function getDashboardStats() {
  try {
    const [postsRow] = await db.select({ total: sql<number>`count(*)::int` }).from(posts);
  const [viewsRow] = await db.select({ sum: sql<number>`coalesce(sum(${posts.viewCount}), 0)::int` }).from(posts);
    return {
      totalPosts: postsRow?.total ?? 0,
      totalViews: viewsRow?.sum ?? 0,
    };
  } catch {
    return { totalPosts: 0, totalViews: 0 };
  }
}

export async function getRecentPostsWithSeo(limit = 5) {
  try {
    return await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      status: posts.status,
      publishedAt: posts.publishedAt,
      viewCount: posts.viewCount,
      titleScore: seoMetadata.titleScore,
      focusKeyword: seoMetadata.focusKeyword,
    })
    .from(posts)
    .leftJoin(seoMetadata, eq(posts.id, seoMetadata.postId))
    .orderBy(desc(posts.updatedAt))
    .limit(limit);
  } catch {
    return [];
  }
}

export async function getAllPosts() {
  try {
    return await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      status: posts.status,
      publishedAt: posts.publishedAt,
      viewCount: posts.viewCount,
      createdAt: posts.createdAt,
      categoryName: categories.name,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .orderBy(desc(posts.createdAt));
  } catch {
    return [];
  }
}

// -----------------------------------------------------------------------------
// CATEGORY helpers
// -----------------------------------------------------------------------------

export async function getActiveCategories() {
  try {
    return await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      })
      .from(categories)
      .orderBy(categories.sortOrder);
  } catch {
    return [];
  }
}

export async function getPostsByCategorySlug(slug: string) {
  try {
    return await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        publishedAt: posts.publishedAt,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(
        and(eq(posts.status, "published"), eq(categories.slug, slug))
      )
      .orderBy(desc(posts.publishedAt));
  } catch {
    return [];
  }
}

export async function getRelatedPosts(currentPostId: string, categoryId: string) {
  try {
    return await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
      })
      .from(posts)
      .where(
        and(
          eq(posts.status, "published"),
          eq(posts.categoryId, categoryId),
          ne(posts.id, currentPostId)
        )
      )
      .orderBy(desc(posts.publishedAt))
      .limit(3);
  } catch {
    return [];
  }
}

