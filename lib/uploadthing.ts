/**
 * UploadThing Configuration
 * Cloud Storage Provider for Media Hub
 * Docs: https://docs.uploadthing.com
 */

import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

let utApi: any = null;

/**
 * Initialize UploadThing API (if credentials available)
 */
function getUTApi() {
  if (process.env.UPLOADTHING_SECRET) {
    try {
      // Only import if needed and installed
      const { UTApi } = require("uploadthing/server");
      if (!utApi) {
        utApi = new UTApi({ token: process.env.UPLOADTHING_SECRET });
      }
      return utApi;
    } catch (error) {
      console.warn("UploadThing not available, using local fallback");
      return null;
    }
  }
  return null;
}

/**
 * Upload file to cloud storage with local fallback
 */
export async function uploadToCloud(file: File, filename: string) {
  const ut = getUTApi();

  // Try cloud upload first
  if (ut) {
    try {
      const formData = new FormData();
      formData.append("files", file);
      const response = await ut.uploadFiles([{ name: filename, file }]);
      if (response && response[0]) {
        return {
          url: response[0].url,
          key: response[0].key,
          name: filename,
        };
      }
    } catch (error) {
      console.warn("Cloud upload failed, falling back to local:", error);
    }
  }

  // Local fallback: save to public/uploads/
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const ext = path.extname(filename) || "";
  const key = `${Date.now()}-${randomUUID()}${ext}`;
  const outPath = path.join(uploadDir, key);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(outPath, buffer);

  return {
    url: `/uploads/${key}`,
    key,
    name: filename,
  };
}

/**
 * Delete file from cloud storage with local fallback
 */
export async function deleteFromCloud(key: string) {
  const ut = getUTApi();

  // Try cloud deletion
  if (ut) {
    try {
      await ut.deleteFiles([key]);
      return true;
    } catch (error) {
      console.warn("Cloud deletion failed, trying local:", error);
    }
  }

  // Local fallback: delete from public/uploads/
  try {
    // If key is a URL like /uploads/xyz.jpg, extract filename
    const filename = key.includes("/") ? key.split("/").pop() : key;
    const filePath = path.join(process.cwd(), "public", "uploads", filename || "");
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error("Local deletion failed:", error);
    return false;
  }
}
