import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq, and, or, ilike } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const pattern = `%${q}%`;

  const results = await db
    .select({ title: posts.title, slug: posts.slug, excerpt: posts.excerpt })
    .from(posts)
    .where(
      and(
        eq(posts.status, "published"),
        or(
          ilike(posts.title, pattern),
          ilike(posts.excerpt, pattern),
          ilike(posts.content, pattern)
        )
      )
    )
    .limit(10);

  return NextResponse.json({ results });
}
