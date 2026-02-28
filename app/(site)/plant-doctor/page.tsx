import Link from "next/link";

export default function PlantDoctor() {
  const services = [
    {
      title: "تشخيص الأمراض",
      emoji: "🩺",
      description: "حدد المشكلة في نباتك بالصور والأعراض"
    },
    {
      title: "خطط العلاج",
      emoji: "💊",
      description: "احصل على خطة علاج مفصلة وآمنة"
    },
    {
      title: "نصائح الوقاية",
      emoji: "🛡️",
      description: "اعرف كيفية الحفاظ على صحة نباتك"
    },
    {
      title: "استشارات مجانية",
      emoji: "💬",
      description: "تواصل مع خبرائنا عن أي اسئلة"
    },
  ];

  return (
    <div className="min-h-screen bg-white py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-forest mb-4 text-center">
          عيادة النبات 🏥
        </h1>
        <p className="text-gray-600 text-center mb-12 text-lg">
          متخصصون في تشخيص وعلاج مشاكل النباتات الداخلية والخارجية
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-soft-green p-8 rounded-lg border border-primary-500 border-opacity-20"
            >
              <div className="text-5xl mb-4">{service.emoji}</div>
              <h3 className="text-2xl font-bold text-forest mb-3">{service.title}</h3>
              <p className="text-gray-700">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-primary-500 text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">هل نباتك يحتاج للمساعدة؟</h2>
          <p className="mb-6">
            شارك أعراض النبات وسنساعدك في إيجاد الحل الأفضل
          </p>
          <Link
            href="/contact"
            className="bg-white text-primary-500 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition inline-block"
          >
            تواصل معنا الآن
          </Link>
        </div>
      </div>
    </div>
  );
}
