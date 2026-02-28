import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import AdminWorkspaceClient from "./AdminWorkspaceClient";

export default async function NewPostPage() {
  let cats: { id: string; name: string; slug: string }[] = [];
  try {
    cats = await db
      .select({ id: categories.id, name: categories.name, slug: categories.slug })
      .from(categories)
      .orderBy(asc(categories.sortOrder));
  } catch {
    cats = [];
  }

  return <AdminWorkspaceClient categories={cats} />;
}
