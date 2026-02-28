import Link from "next/link";

export default function Herbs() {
  const herbs = [
    { name: "النعناع", emoji: "🌿", description: "عشبة منعشة وسهلة الزراعة" },
    { name: "الريحان", emoji: "🌱", description: "عطري وفاتح للشهية" },
    { name: "الزعتر", emoji: "🍃", description: "عشبة تقليدية غنية بالفوائد" },
    { name: "إكليل الجبل", emoji: "🌾", description: "معطر ومليء بمضادات الأكسدة" },
    { name: "البقدونس", emoji: "🥬", description: "عشبة أساسية في المطبخ" },
    { name: "الشبت", emoji: "🌿", description: "خفيف ومنعش الطعم" },
  ];

  return (
    <div className="min-h-screen bg-white py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-forest mb-4 text-center">
          الأعشاب العطرية
        </h1>
        <p className="text-gray-600 text-center mb-12 text-lg">
          اكتشف أسهل الطرق لزراعة الأعشاب الطازة في بيتك
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {herbs.map((herb) => (
            <Link
              key={herb.name}
              href="/blog"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-primary-500 transition"
            >
              <div className="text-5xl mb-4">{herb.emoji}</div>
              <h3 className="text-xl font-bold text-forest mb-2">{herb.name}</h3>
              <p className="text-gray-600">{herb.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
