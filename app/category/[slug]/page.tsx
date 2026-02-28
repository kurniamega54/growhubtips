import { getPostsByCategorySlug } from "@/lib/queries";
import { notFound } from "next/navigation";
import { PostCard } from "@/app/components/PostCard";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const posts = await getPostsByCategorySlug(params.slug);
  const title = posts?.[0]?.categoryName || params.slug;
  return { title, description: `Articles about ${title}` };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = params;
  const posts = await getPostsByCategorySlug(slug);
  if (!posts || posts.length === 0) {
    notFound();
  }

  const categoryName = posts[0].categoryName || slug;

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary-700 mb-8">{categoryName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((p) => (
          <PostCard
            key={p.slug}
            title={p.title}
            excerpt={p.excerpt || ""}
            image={""} // placeholder; could be extended later
          />
        ))}
      </div>
    </section>
  );
}
