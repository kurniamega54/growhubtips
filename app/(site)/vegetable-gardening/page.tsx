export default function VegetableGardening() {
  const tips = [
    {
      season: "الربيع",
      crops: "الطماطم، الخيار، الفلفل",
      tips: "استعد التربة وأضف السماد العضوي"
    },
    {
      season: "الصيف",
      crops: "الكوسة، الباذنجان، البامية",
      tips: "اسقِ بانتظام واحذر من الحرارة الشديدة"
    },
    {
      season: "الخريف",
      crops: "الملفوف، الجزر، البنجر",
      tips: "زِع البذور قبل انخفاض درجات الحرارة"
    },
    {
      season: "الشتاء",
      crops: "الخس، السبانخ، البقدونس",
      tips: "استخدم بيوت زجاجية أو غطاء حماية"
    },
  ];

  return (
    <div className="min-h-screen bg-white py-12 md:py-24">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-forest mb-4 text-center">
          البستنة الخضراء
        </h1>
        <p className="text-gray-600 text-center mb-12 text-lg">
          دليل شامل لزراعة الخضار عبر السنة
        </p>

        <div className="space-y-6">
          {tips.map((season) => (
            <div key={season.season} className="bg-soft-green p-6 rounded-lg border-l-4 border-primary-500">
              <h3 className="text-2xl font-bold text-forest mb-3">{season.season}</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold text-gray-900">الخضار الموسمية:</span>
                  <span className="text-gray-700"> {season.crops}</span>
                </p>
                <p>
                  <span className="font-semibold text-gray-900">النصيحة:</span>
                  <span className="text-gray-700"> {season.tips}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-primary-500 text-white p-8 rounded-lg mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">ابدأ حديقتك اليوم!</h2>
          <p>سهل أكثر مما تتخيل - اتبع نصائحنا وستحصل على خضار طازة في منزلك</p>
        </div>
      </div>
    </div>
  );
}
