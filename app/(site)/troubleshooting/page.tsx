export default function Troubleshooting() {
  const issues = [
    {
      title: "أوراق النبات تتحول إلى اللون الأصفر",
      causes: ["الرطوبة الزائدة", "نقص التصريف", "الإضاءة الضعيفة"],
      solution: "قلل التصريف وضع النبات في مكان أفضل إضاءة"
    },
    {
      title: "الأوراق جافة وضعيفة",
      causes: ["نقص الرطوبة", "الهواء الجاف", "عدم الري الكافي"],
      solution: "زد التصراف ورطب الهواء حول النبات"
    },
    {
      title: "آفات وحشرات على النبات",
      causes: ["العدوى من نبات آخر", "الهواء الرطب جداً", "قلة التهوية"],
      solution: "استخدم محلول صابون أو زيت نيم"
    },
    {
      title: "النبات لا ينمو",
      causes: ["التربة السيئة", "نقص الضوء", "نقص التسميد"],
      solution: "غير التربة وأضف سماد عضوي"
    },
  ];

  return (
    <div className="min-h-screen bg-white py-12 md:py-24">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-forest mb-4 text-center">
          تشخيص مشاكل النباتات
        </h1>
        <p className="text-gray-600 text-center mb-12 text-lg">
          حلول عملية للمشاكل الشائعة في تربية النباتات
        </p>

        <div className="space-y-6">
          {issues.map((issue, idx) => (
            <div key={idx} className="bg-soft-green p-6 rounded-lg border-l-4 border-primary-500">
              <h3 className="text-2xl font-bold text-forest mb-3">{issue.title}</h3>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">الأسباب المحتملة:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {issue.causes.map((cause) => (
                    <li key={cause}>{cause}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">الحل:</h4>
                <p className="text-gray-700">{issue.solution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
