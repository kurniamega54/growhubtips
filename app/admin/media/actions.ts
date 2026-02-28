import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";
import { deleteFromCloud } from "@/lib/uploadthing";

export type SaveMediaInput = {
  url: string;
  key: string;
  name: string;
  file_type?: string | null;
  file_size?: number | null;
  width?: number | null;
  height?: number | null;
  alt_text?: string | null;
  caption?: string | null;
  title?: string | null;
};

export async function saveMediaAction(data: SaveMediaInput) {
  const [row] = await db
    .insert(media)
    .values({
      url: data.url,
      key: data.key,
      name: data.name,
      file_type: data.file_type ?? null,
      file_size: data.file_size ?? null,
      width: data.width ?? null,
      height: data.height ?? null,
      alt_text: data.alt_text ?? null,
      caption: data.caption ?? null,
      title: data.title ?? null,
      focus_keyword_relevance: null,
    })
    .returning();

  return row;
}

export async function updateMediaMetadata(
  id: string,
  updates: Partial<SaveMediaInput>
) {
  const result = await db
    .update(media)
    .set({
      alt_text: updates.alt_text ?? undefined,
      caption: updates.caption ?? undefined,
      title: updates.title ?? undefined,
      name: updates.name ?? undefined,
    })
    .where(eq(media.id, id))
    .returning();

  return result;
}

export async function deleteMediaAction(id: string) {
  // Find media row
  const rows = await db.select().from(media).where(eq(media.id, id));
  const row = rows[0];
  if (!row) return { ok: false, error: "Not found" };

  // Delete from cloud storage (UploadThing/Vercel Blob)
  if (row.key) {
    const deleted = await deleteFromCloud(row.key);
    if (!deleted) {
      console.warn(`Failed to delete ${row.key} from cloud storage`);
    }
  }

  // Fallback: Try delete from local disk if it looks like local
  try {
    if (row.url && row.url.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", row.url.replace(/^\//, ""));
      await fs.unlink(filePath).catch(() => {});
    }
  } catch (err) {
    console.error("Error deleting file from storage:", err);
  }

  await db.delete(media).where(eq(media.id, id));
  return { ok: true };
}
