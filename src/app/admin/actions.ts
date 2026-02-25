"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import type { EditorJson } from "@/src/types/editor";

export async function autoSavePostAction(params: {
  postId: string;
  contentJson: EditorJson | null;
}) {
  const { postId, contentJson } = params;
  const now = new Date();

  await db
    .update(posts)
    .set({ contentJson, lastSaved: now })
    .where(eq(posts.id, postId));
  revalidatePath("/admin");

  return { lastSaved: now.toISOString() };
}
