import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const decodedKey = decodeURIComponent(key);
    const rows = await db.select().from(media).where(eq(media.key, decodedKey));
    const row = rows[0];
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Try delete from local disk if it looks like a local file
    try {
      if (row.url && row.url.startsWith("/uploads/")) {
        const filePath = path.join(process.cwd(), "public", row.url.replace(/^\//, ""));
        await fs.unlink(filePath).catch(() => {});
      }

      // TODO: When UploadThing is ready, call:
      // import { UTApi } from "uploadthing/server";
      // const ut = new UTApi({ token: process.env.UPLOADTHING_SECRET! });
      // await ut.deleteFiles([decodedKey]);
    } catch (err) {
      console.error("Error deleting file from storage:", err);
    }

    await db.delete(media).where(eq(media.id, row.id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
