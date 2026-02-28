import Link from "next/link";

export default function Plants() {
  const plants = [
    { name: "الألوفيرا", emoji: "🌿", description: "نبات سهل العناية غني بالفوائد" },
    { name: "الإسبيدسترا", emoji: "🍃", description: "نبات مظلل وقوي جداً" },
    { name: "الدراسينا", emoji: "🌱", description: "نبات ديكوري جميل وملون" },
    { name: "الفيل بيت", emoji: "🌿", description: "نبات سام للحيوانات - احذر" },
    { name: "زنبق السلام", emoji: "🌸", description: "ينقي الهواء بفعالية" },
    { name: "الجنيه الذهبي", emoji: "💚", description: "متسلقة جميلة للمشاتل" },
  ];

  return (
    <div className="min-h-screen bg-white py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-forest mb-4 text-center">
          نباتات داخلية
        </h1>
        <p className="text-gray-600 text-center mb-12 text-lg">
          اكتشف أجمل النباتات الداخلية وكيفية العناية بها
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((plant) => (
            <Link
              key={plant.name}
              href="/blog"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-primary-500 transition"
            >
              <div className="text-5xl mb-4">{plant.emoji}</div>
              <h3 className="text-xl font-bold text-forest mb-2">{plant.name}</h3>
              <p className="text-gray-600">{plant.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
