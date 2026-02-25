import Link from "next/link";
import { getPublishedPosts } from "@/lib/queries";

const gradients = [
  "from-primary-200 to-primary-400",
  "from-secondary-400 to-primary-300",
  "from-primary-300 to-secondary-400",
];

export async function FeaturedArticles() {
  const posts = await getPublishedPosts(6);

  if (posts.length === 0) {
    return (
      <div>
        <h2 className="font-heading text-3xl font-bold text-primary-700 mb-2 text-center">
          Featured Articles
        </h2>
        <p className="text-primary-600 text-center mb-10">No articles yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-heading text-3xl font-bold text-primary-700 mb-2 text-center">
        Featured Articles
      </h2>
      <p className="text-primary-600 text-center mb-10 max-w-xl mx-auto">
        Our most popular guides to get you started.
      </p>
      <div className="grid md:grid-cols-3 gap-8">
        {posts.slice(0, 6).map((post, i) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group block bg-white rounded-2xl shadow-organic overflow-hidden hover:shadow-lg transition-all duration-200"
          >
            <div
              className={`h-44 bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center`}
            >
              <span className="text-6xl opacity-80" aria-hidden>🌱</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-primary-700 mb-2 group-hover:text-primary-600">
                {post.title}
              </h3>
              <p className="text-primary-600 mb-4 line-clamp-2">{post.excerpt ?? ""}</p>
              <span className="inline-flex items-center gap-1 font-semibold text-accent-500 group-hover:gap-2 transition-all">
                Read More →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
