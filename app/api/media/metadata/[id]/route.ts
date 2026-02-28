import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { alt_text, caption, title, name } = body;

    const result = await db
      .update(media)
      .set({
        alt_text: alt_text ?? undefined,
        caption: caption ?? undefined,
        title: title ?? undefined,
        name: name ?? undefined,
      })
      .where(eq(media.id, id))
      .returning();

    return NextResponse.json({ item: result[0] ?? null });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
