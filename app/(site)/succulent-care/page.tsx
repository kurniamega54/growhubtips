import Link from "next/link";

export default function SucculentCare() {
  const succulents = [
    { name: "الألوفيرا", emoji: "🌵", care: "أقل سقياً، إضاءة جيدة" },
    { name: "الإيكو", emoji: "🍃", care: "متوسطة الرطوبة والإضاءة" },
    { name: "السيدوم", emoji: "💚", care: "تربة جيدة التصريف، ماء قليل" },
    { name: "الجيليوم", emoji: "🌸", care: "إضاءة ساطعة، رطوبة منخفضة" },
    { name: "الشحوم", emoji: "🌺", care: "أقل رطوبة، إضاءة عالية" },
    { name: "الأجاف", emoji: "🌿", care: "جاف جداً، إضاءة كاملة" },
  ];

  return (
    <div className="min-h-screen bg-white py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-forest mb-4 text-center">
          العناية بالنباتات الدهنية
        </h1>
        <p className="text-gray-600 text-center mb-12 text-lg">
          نباتات جميلة وسهلة جداً تحتاج إلى عناية أقل
        </p>

        <div className="bg-soft-green p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-bold text-forest mb-4">نصائح العناية الأساسية:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>تربة جيدة التصريف جداً (حصى + رمل + تربة)</li>
            <li>سقياً قليلاً جداً - مرة واحدة كل 3-4 أسابيع</li>
            <li>إضاءة ساطعة مباشرة لعدة ساعات يومياً</li>
            <li>درجة حرارة دافئة في النهار، باردة في الليل</li>
            <li>لا تستخدم أسمدة عالية النيتروجين</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {succulents.map((succ) => (
            <div
              key={succ.name}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="text-5xl mb-4">{succ.emoji}</div>
              <h3 className="text-xl font-bold text-forest mb-2">{succ.name}</h3>
              <p className="text-gray-600">{succ.care}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
