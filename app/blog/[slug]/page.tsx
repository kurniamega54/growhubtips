import { db } from "@/lib/db";
import { posts, seoMetadata, categories } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentRenderer } from "@/app/components/ContentRenderer";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [row] = await db
    .select({
      title: posts.title,
      excerpt: posts.excerpt,
      seoTitle: seoMetadata.seoTitle,
      metaDesc: seoMetadata.metaDescription,
      ogImage: seoMetadata.ogImage,
    })
    .from(posts)
    .leftJoin(seoMetadata, eq(posts.id, seoMetadata.postId))
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")));

  if (!row) return { title: "Not Found" };

  return {
    title: row.seoTitle ?? row.title,
    description: row.metaDesc ?? row.excerpt ?? undefined,
    openGraph: {
      title: row.seoTitle ?? row.title,
      description: row.metaDesc ?? row.excerpt ?? undefined,
      images: row.ogImage ? [row.ogImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post] = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      contentJson: posts.contentJson,
      excerpt: posts.excerpt,
      publishedAt: posts.publishedAt,
      readingTimeMinutes: posts.readingTimeMinutes,
      categoryName: categories.name,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")));

  if (!post || (!post.content && !post.contentJson)) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-8">
        {post.categoryName && (
          <p className="text-primary-500 text-sm font-medium mb-2">{post.categoryName}</p>
        )}
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-700 mb-4">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-primary-600 text-lg">{post.excerpt}</p>
        )}
        <div className="mt-4 text-primary-500 text-sm">
          {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}
          {post.readingTimeMinutes && ` · ${post.readingTimeMinutes} min read`}
        </div>
      </header>
      <div>
        {post.contentJson && typeof post.contentJson === "object" ? (
          <ContentRenderer content={post.contentJson as any} />
        ) : post.content ? (
          <div
            className="prose prose-lg prose-primary max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : null}
      </div>

    </article>
  );
}
