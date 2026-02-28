"use server";

import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface SettingsInput {
  siteName: string;
  contactEmail: string;
  instagramUrl: string;
  pinterestUrl: string;
}

export async function updateSettingsAction(input: SettingsInput) {
  try {
    // Update each setting individually (upsert pattern)
    await db
      .insert(siteSettings)
      .values({
        key: "site_name",
        value: input.siteName,
      })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: input.siteName },
      });

    await db
      .insert(siteSettings)
      .values({
        key: "contact_email",
        value: input.contactEmail,
      })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: input.contactEmail },
      });

    await db
      .insert(siteSettings)
      .values({
        key: "instagram_url",
        value: input.instagramUrl,
      })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: input.instagramUrl },
      });

    await db
      .insert(siteSettings)
      .values({
        key: "pinterest_url",
        value: input.pinterestUrl,
      })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: input.pinterestUrl },
      });

    revalidatePath("/admin/settings");
    return { success: true, message: "Settings updated successfully" };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, message: "Failed to update settings" };
  }
}

export async function getSettings() {
  try {
    const settings = await db
      .select({ key: siteSettings.key, value: siteSettings.value })
      .from(siteSettings);

    const result: Record<string, string> = {};
    settings.forEach((s) => {
      result[s.key || ""] = s.value || "";
    });
    return result;
  } catch {
    return {};
  }
}
