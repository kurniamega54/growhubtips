import Link from "next/link";

export default function IndoorPlants() {
  const plants = [
    { name: "الفيلوديندرون", emoji: "🌿", description: "سهل جداً ومتسامح" },
    { name: "السحلبية", emoji: "🌸", description: "أنيقة وتحتاج عناية خاصة" },
    { name: "الأرز الداخلي", emoji: "🌲", description: "تنقي الهواء بفعالية" },
    { name: "نبات الإسبيدسترا", emoji: "🍃", description: "القاسي والمظلم" },
    { name: "الكالاديوم", emoji: "🌺", description: "ألوان جميلة جداً" },
    { name: "البوتس الذهبي", emoji: "💛", description: "نبات متسلق جميل" },
  ];

  return (
    <div className="min-h-screen bg-white py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-forest mb-4 text-center">
          النباتات الداخلية الأنيقة
        </h1>
        <p className="text-gray-600 text-center mb-12 text-lg">
          زيّن منزلك بنباتات خضراء وحية
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
