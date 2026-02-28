import { NextRequest, NextResponse } from "next/server";
import { getActiveCategories } from "@/lib/queries";

export async function GET(req: NextRequest) {
  const cats = await getActiveCategories();
  return NextResponse.json({ categories: cats });
}
