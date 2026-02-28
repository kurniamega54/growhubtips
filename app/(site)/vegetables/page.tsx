import Link from "next/link";

export default function Vegetables() {
  const vegetables = [
    { name: "الطماطم", emoji: "🍅", description: "ملك الخضار في الحديقة" },
    { name: "الخيار", emoji: "🥒", description: "منعش وسهل الزراعة" },
    { name: "الفلفل", emoji: "🌶️", description: "نكهة مميزة وألوان خلابة" },
    { name: "الجزر", emoji: "🥕", description: "غني بالفيتامينات والألياف" },
    { name: "الكوسة", emoji: "🍃", description: "خضار صيفية لذيذة" },
    { name: "الباذنجان", emoji: "🍆", description: "نبات متطلب لكنه رائع" },
  ];

  return (
    <div className="min-h-screen bg-white py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-forest mb-4 text-center">
          زراعة الخضار
        </h1>
        <p className="text-gray-600 text-center mb-12 text-lg">
          نصائح عملية لزراعة خضار صحية وطازة في منزلك
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vegetables.map((veg) => (
            <Link
              key={veg.name}
              href="/blog"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-primary-500 transition"
            >
              <div className="text-5xl mb-4">{veg.emoji}</div>
              <h3 className="text-xl font-bold text-forest mb-2">{veg.name}</h3>
              <p className="text-gray-600">{veg.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
