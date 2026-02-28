import { NextResponse } from "next/server";
import { runDailySeoJob } from "@/lib/seoStrategy";

export async function GET() {
  try {
    await runDailySeoJob();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Cron failed", err);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
