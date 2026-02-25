export function PostCard({ title, excerpt, image }: { title: string; excerpt: string; image: string }) {
  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
      <img
        src={image}
        alt={title}
        width={400}
        height={200}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#2D5A27] mb-2">{title}</h3>
        <p className="text-gray-700 mb-4">{excerpt}</p>
        <button className="bg-[#8E9775] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#2D5A27] transition">
          Read More
        </button>
      </div>
    </article>
  );
}
