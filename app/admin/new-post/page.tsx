import { NewPostForm } from "./NewPostForm";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export default async function NewPostPage() {
  let cats: { id: string; name: string; slug: string }[] = [];
  try {
    cats = await db.select({ id: categories.id, name: categories.name, slug: categories.slug }).from(categories).orderBy(asc(categories.sortOrder));
  } catch {
    cats = [];
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-primary-700 mb-8">New Post</h1>
      <NewPostForm categories={cats} />
    </div>
  );
}
