import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { uploadToCloud } from "@/lib/uploadthing";

export async function GET() {
  try {
    const rows = await db.select().from(media).orderBy(desc(media.created_at));
    return NextResponse.json({ items: rows });
  } catch (error) {
    console.error("GET /api/media error", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const filename = file.name || "upload";

    // Upload file using cloud provider (with local fallback)
    const uploadResult = await uploadToCloud(file, filename);

    // Insert metadata into database
    const [row] = await db.insert(media).values({
      url: uploadResult.url,
      key: uploadResult.key,
      name: uploadResult.name,
      file_type: file.type || "application/octet-stream",
      file_size: file.size,
      width: null,
      height: null,
      alt_text: filename,
      caption: null,
      title: filename,
      focus_keyword_relevance: null,
    }).returning();

    return NextResponse.json({ item: row });
  } catch (error) {
    console.error("POST /api/media error", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
