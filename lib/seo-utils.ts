import { db } from "@/lib/db";
import { posts, seoMetadata } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export type SlugMetadata = {
  title: string;
  excerpt: string | null;
  seoTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
};

/**
 * Fetches SEO-related fields for a given post slug. The query
 * joins the posts table with seo_metadata and only returns
 * published posts. If no matching post is found, null is returned.
 */
export async function getMetadataForSlug(slug: string): Promise<SlugMetadata | null> {
  const [row] = await db
    .select({
      title: posts.title,
      excerpt: posts.excerpt,
      seoTitle: seoMetadata.seoTitle,
      metaDescription: seoMetadata.metaDescription,
      ogImage: seoMetadata.ogImage,
    })
    .from(posts)
    .leftJoin(seoMetadata, eq(posts.id, seoMetadata.postId))
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")));

  if (!row) return null;

  return {
    title: row.title,
    excerpt: row.excerpt,
    seoTitle: row.seoTitle,
    metaDescription: row.metaDescription,
    ogImage: row.ogImage,
  };
}
