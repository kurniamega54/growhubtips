"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { posts, seoMetadata, authors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createPostSchema } from "@/lib/validations/post";
import * as schema from "@/lib/db/schema";

type JsonNode = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: JsonNode[];
  text?: string;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
};

function collectText(node: JsonNode | undefined, text: string[] = []) {
  if (!node) return text;
  if (node.type === "text" && node.text) text.push(node.text);
  node.content?.forEach((child) => collectText(child, text));
  return text;
}

function extractTextFromJson(root?: JsonNode | null) {
  if (!root) return "";
  return collectText(root).join(" ").replace(/\s+/g, " ").trim();
}

function computeReadingTimeMinutes(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

function parseContentJson(value: unknown) {
  if (!value) return null;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as JsonNode;
    } catch {
      return null;
    }
  }
  if (typeof value === "object") return value as JsonNode;
  return null;
}

function requireAuth() {
  // TODO: if (!session) redirect("/login");
}

export async function createPostAction(formData: FormData | Record<string, unknown>) {
  requireAuth();
  const raw = formData instanceof FormData
    ? Object.fromEntries(formData.entries())
    : formData;
  const contentJson = parseContentJson(raw.contentJson);
  raw.contentJson = contentJson ?? undefined;
  if (raw.categoryId === "") raw.categoryId = null;
  const parsed = createPostSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  const contentText = data.content?.trim() || extractTextFromJson(contentJson);
  if (!contentText && !contentJson) {
    return { error: { content: ["Content is required."] } };
  }

  try {
    const [author] = await db.select().from(authors).limit(1);
    if (!author) {
      return { error: { _form: ["No author found. Run seed first."] } };
    }

    const [post] = await db
      .insert(posts)
      .values({
        authorId: author.id,
        categoryId: data.categoryId ?? null,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt ?? null,
        content: contentText || null,
        contentJson: contentJson ?? null,
        readingTimeMinutes: computeReadingTimeMinutes(contentText),
        status: data.status,
        publishedAt: data.status === "published" ? new Date() : null,
      })
      .returning();

    if (!post) return { error: { _form: ["Failed to create post"] } };

    await db.insert(seoMetadata).values({
      postId: post.id,
      focusKeyword: data.focusKeyword ?? null,
      seoTitle: data.seoTitle ?? data.title,
      metaDescription: data.metaDescription ?? data.excerpt ?? null,
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/all-posts");
    redirect("/admin/all-posts");
  } catch (e) {
    console.error("createPostAction error:", e);
    return { error: { _form: [e instanceof Error ? e.message : "Unknown error"] } };
  }
}

export async function autoSavePostAction(input: {
  postId?: string | null;
  title?: string;
  slug?: string;
  excerpt?: string;
  contentJson?: JsonNode | null;
  focusKeyword?: string;
  seoTitle?: string;
  metaDescription?: string;
  seoScore?: number;
  featuredImageId?: string | null;
}) {
  requireAuth();

  const title = (input.title ?? "").trim();
  const slug = (input.slug ?? "").trim();
  if (!title || !slug) {
    return { error: "Title and slug are required to save." } as const;
  }

  const contentText = extractTextFromJson(input.contentJson);
  const readingTimeMinutes = computeReadingTimeMinutes(contentText);
  const now = new Date();

  try {
    const [author] = await db.select().from(authors).limit(1);
    if (!author) return { error: "No author found." } as const;

    let postId = input.postId ?? null;
    if (postId) {
      await db
        .update(posts)
        .set({
          title,
          slug,
          excerpt: input.excerpt ?? null,
          content: contentText || null,
          contentJson: input.contentJson ?? null,
          readingTimeMinutes,
          status: "draft",
          featuredImageId: input.featuredImageId ?? null,
          updatedAt: now,
        })
        .where(eq(posts.id, postId));
    } else {
      const [draft] = await db
        .insert(posts)
        .values({
          authorId: author.id,
          title,
          slug,
          excerpt: input.excerpt ?? null,
          content: contentText || null,
          contentJson: input.contentJson ?? null,
          readingTimeMinutes,
          status: "draft",
          featuredImageId: input.featuredImageId ?? null,
          publishedAt: null,
        })
        .returning();
      postId = draft?.id ?? null;
    }

    if (postId) {
      await db
        .insert(seoMetadata)
        .values({
          postId,
          focusKeyword: input.focusKeyword ?? null,
          seoTitle: input.seoTitle ?? title,
          metaDescription: input.metaDescription ?? null,
          seoScore: input.seoScore ?? null,
        })
        .onConflictDoUpdate({
          target: seoMetadata.postId,
          set: {
            focusKeyword: input.focusKeyword ?? null,
            seoTitle: input.seoTitle ?? title,
            metaDescription: input.metaDescription ?? null,
            seoScore: input.seoScore ?? null,
            updatedAt: now,
          },
        });
    }

    return { postId, lastSavedAt: now.toISOString() } as const;
  } catch (e) {
    console.error("autoSavePostAction error:", e);
    return { error: e instanceof Error ? e.message : "Unknown error" } as const;
  }
}

export async function deletePostAction(postId: string) {
  requireAuth();
  try {
    await db.delete(posts).where(eq(posts.id, postId));
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/all-posts");
    return { success: true };
  } catch (e) {
    console.error("deletePostAction error:", e);
    return { error: e instanceof Error ? e.message : "Failed to delete" };
  }
}

/**
 * Update page content (used by admin page editor)
 */
export async function updatePageContentAction(
  slug: string,
  contentJson: Record<string, unknown>,
  title?: string
) {
  requireAuth();
  try {
    if (!slug || !contentJson) {
      return { success: false, message: "Missing required parameters" };
    }

    const existing = await db.query.pageContent.findFirst({
      where: eq(schema.pageContent.slug, slug),
    });

    if (existing) {
      await db
        .update(schema.pageContent)
        .set({
          content: contentJson,
          title: title ?? existing.title,
          updatedAt: new Date(),
        })
        .where(eq(schema.pageContent.slug, slug));

      revalidatePath(`/${slug}`);
      revalidatePath("/");

      return { success: true, message: `Page '${slug}' updated` };
    }

    // If page does not exist, create a draft page
    const [row] = await db.insert(schema.pageContent).values({
      slug,
      title: title ?? slug,
      content: contentJson,
      status: "draft",
      publishedAt: null,
    }).returning();

    revalidatePath(`/${slug}`);
    revalidatePath("/");

    return { success: true, message: `Page '${slug}' created`, data: { id: row?.id } };
  } catch (e) {
    console.error("updatePageContentAction error:", e);
    return { success: false, message: e instanceof Error ? e.message : "Failed to update page" };
  }
}
