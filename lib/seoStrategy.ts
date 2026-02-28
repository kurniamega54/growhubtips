import { KeywordMetrics, computePriorityScore, fetchLowHangingFruit, fetchAdsMetrics } from "./services/google-analytics";
import { db } from "./db";
import { keywordStrategy } from "./db/schema";
import { eq } from "drizzle-orm";

/**
 * Server action that receives top keywords and asks an LLM to craft titles.
 * This example uses Claude 3.5 via an HTTP request; replace with actual SDK.
 */
export async function generateAITitlesAction(topKeywords: string[]) {
  // build prompt
  const prompt = `Generate research-driven article titles for the following keywords,` +
    ` with an academic tone suitable for Stanford STORM engine.\n` +
    topKeywords.map((k, i) => `${i + 1}. ${k}`).join("\n");

  // call LLM (stubbed)
  // TODO: replace with real Claude/Anthropic SDK and attach API key
  const response = await fetch("https://api.anthropic.com/v1/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ANTHROPIC_API_KEY}`,
    },
    body: JSON.stringify({
      model: "claude-3.5", // example
      prompt,
      max_tokens: 300,
    }),
  });
  const data = await response.json();
  const text = data?.completion || "";

  // split titles by lines and return
  return text.split("\n").map((t: string) => t.trim()).filter((t: string) => t);
}

/**
 * Cronable function executed every day by our job system.
 */
export async function runDailySeoJob() {
  // 1. fetch low-hanging fruit keywords
  const keywords = await fetchLowHangingFruit();

  // 2. enrich with ads metrics and compute score
  for (const kw of keywords) {
    const ads = await fetchAdsMetrics(kw.keyword);
    kw.google_ads_cpc = ads.cpc;
    kw.competition_level = ads.competition;
    const score = computePriorityScore(kw);
    // insert/update strategy table
    await db.insert(keywordStrategy).values({
      keyword: kw.keyword,
      gsc_impressions: kw.gsc_impressions,
      gsc_clicks: kw.gsc_clicks,
      gsc_position: kw.gsc_position,
      google_ads_cpc: kw.google_ads_cpc,
      competition_level: kw.competition_level,
      trending_status: false,
      status: "draft",
    } as any).onConflictDoUpdate({
      target: keywordStrategy.keyword,
      set: {
        gsc_impressions: kw.gsc_impressions,
        gsc_clicks: kw.gsc_clicks,
        gsc_position: kw.gsc_position,
        google_ads_cpc: kw.google_ads_cpc,
        competition_level: kw.competition_level,
        updated_at: new Date(),
      } as any,
    });
  }

  // 3. pick top entry by priority score
  const all = await db.select().from(keywordStrategy);
  all.sort((a, b) => {
    const sa = computePriorityScore(a as unknown as KeywordMetrics);
    const sb = computePriorityScore(b as unknown as KeywordMetrics);
    return sb - sa;
  });
  const top = all[0];
  if (!top) return;

  // 4. generate title via AI
  const titles = await generateAITitlesAction([top.keyword]);
  const generated = titles[0] || "";

  // 5. prepare STORM research query URL
  const query = `https://storm.genie.stanford.edu/?q=${encodeURIComponent(generated)}`;

  // 6. update strategy record

  await db.update(keywordStrategy).set({
    generated_title: generated,
    storm_article_url: query,
    status: "researching",
    updated_at: new Date(),
  } as any).where(eq(keywordStrategy.keyword, top.keyword));
}
