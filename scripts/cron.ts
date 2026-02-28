#!/usr/bin/env ts-node

/*
 * Daily cron entrypoint. Deploy using Vercel Cron or any scheduler.
 * This script loads the environment, then invokes the SEO job.
 */
import { runDailySeoJob } from "../lib/seoStrategy";

(async () => {
  try {
    console.log("Starting daily SEO cron job");
    await runDailySeoJob();
    console.log("Daily SEO cron completed");
    process.exit(0);
  } catch (err) {
    console.error("SEO cron error", err);
    process.exit(1);
  }
})();
