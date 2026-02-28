/**
 * GrowHubTips - Final Super-Stable Database Seed Script
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { sql } from "drizzle-orm";
import { db } from "../lib/db";

async function seed() {
  console.log("🌱 Seeding GrowHubTips database...\n");

  try {
    // 1. Prepare media
    console.log("Preparing media...");
    let mediaId: string;
    const mediaResult = await db.execute(sql`SELECT id FROM media_library LIMIT 1`);
    const mediaRows = (mediaResult as any).rows || mediaResult;
    
    if (mediaRows && mediaRows.length > 0) {
      mediaId = mediaRows[0].id;
      console.log("✓ Using existing media:", mediaId);
    } else {
      console.log("Inserting new media...");
      const insertMedia = await db.execute(sql`
        INSERT INTO media_library (url, alt_text, title, width, height, file_size_bytes, mime_type)
        VALUES ('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800', 'Lush indoor monstera plant in pot', 'Monstera Indoor Plant', 800, 600, 120000, 'image/jpeg')
        RETURNING id
      `);
      const insertedMediaRows = (insertMedia as any).rows || insertMedia;
      mediaId = insertedMediaRows[0].id;
      console.log("✓ Created new media:", mediaId);
    }

    // 2. Prepare user
    console.log("Preparing user...");
    const userResult = await db.execute(sql`SELECT id FROM users WHERE email = 'admin@growhubtips.com' LIMIT 1`);
    const userRows = (userResult as any).rows || userResult;
    let userId: string;
    
    if (userRows && userRows.length > 0) {
      userId = userRows[0].id;
      console.log("✓ Using existing user:", userId);
    } else {
      console.log("Inserting new user...");
      const insertUser = await db.execute(sql`
        INSERT INTO users (email, name, role)
        VALUES ('admin@growhubtips.com', 'GrowHub Team', 'author')
        RETURNING id
      `);
      const insertedUserRows = (insertUser as any).rows || insertUser;
      userId = insertedUserRows[0].id;
      console.log("✓ Created new user:", userId);
    }

    // 3. Prepare author
    console.log("Preparing author...");
    // Direct SQL check to bypass driver UUID mapping issues
    const authorCheck = await db.execute(sql`SELECT id FROM authors WHERE user_id = ${userId}::uuid LIMIT 1`);
    const authorRows = (authorCheck as any).rows || authorCheck;
    
    if (!authorRows || authorRows.length === 0) {
      console.log("Inserting new author...");
      await db.execute(sql`
        INSERT INTO authors (user_id, display_name, slug, bio, expert_credentials, reputation_score, profile_image_id)
        VALUES (${userId}::uuid, 'GrowHub Expert', 'growhub-expert', 'Certified horticulturist with 15+ years of urban gardening experience.', 'Certified Horticulturist', 98.5, ${mediaId}::uuid)
      `);
      console.log("✓ Created new author");
    } else {
      console.log("✓ Author already exists");
    }

    // 4. Create categories
    const categoryData = [
      { name: "Indoor Plants", slug: "indoor-plants", sortOrder: 1 },
      { name: "Vegetable Gardening", slug: "vegetable-gardening", sortOrder: 2 },
    ];

    for (const cat of categoryData) {
      const catCheck = await db.execute(sql`SELECT id FROM categories WHERE slug = ${cat.slug} LIMIT 1`);
      const catRows = (catCheck as any).rows || catCheck;
      if (!catRows || catRows.length === 0) {
        await db.execute(sql`
          INSERT INTO categories (name, slug, sort_order)
          VALUES (${cat.name}, ${cat.slug}, ${cat.sortOrder})
        `);
      }
    }
    console.log("✓ Categories ready");

    console.log("\n✅ Seed completed successfully!");
  } catch (err) {
    console.error("❌ Seed failed with detailed error:", err);
  }
}

seed();
