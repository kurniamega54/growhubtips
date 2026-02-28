import React from "react";
import Link from "next/link";
import { getRelatedPosts } from "@/lib/queries";

interface RelatedPostsProps {
  currentPostId: string;
  categoryId: string;
}

export default async function RelatedPosts({ currentPostId, categoryId }: RelatedPostsProps) {
  const posts = await getRelatedPosts(currentPostId, categoryId);

  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-heading font-bold text-primary-700 mb-6">Related Articles</h2>
      <div className="flex gap-6 overflow-x-auto pb-2">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="min-w-[200px] flex-shrink-0 bg-white rounded-organic shadow-md hover:shadow-lg transition overflow-hidden"
          >
            <div className="h-32 bg-gray-100" /> {/* placeholder thumbnail */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-primary-700">{p.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
