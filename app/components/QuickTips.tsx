const tips = [
  { icon: "💧", text: "Water when top 2 inches of soil are dry" },
  { icon: "☀️", text: "Most houseplants need bright, indirect light" },
  { icon: "🌡️", text: "Keep temps 65–75°F for tropical plants" },
  { icon: "🔄", text: "Rotate pots weekly for even growth" },
  { icon: "✂️", text: "Trim yellow leaves to redirect energy" },
  { icon: "🪴", text: "Repot when roots circle the pot" },
];

export function QuickTips() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-700 text-center mb-4">
          Quick Tips for Happy Plants
        </h2>
        <p className="text-primary-600 text-center max-w-2xl mx-auto mb-12">
          Bite-sized wisdom you can use right away.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tips.map((tip) => (
            <div
              key={tip.text}
              className="flex items-center gap-4 p-4 rounded-xl bg-primary-50 border border-primary-100 hover:border-primary-200 transition-colors"
            >
              <span className="text-2xl shrink-0" aria-hidden>{tip.icon}</span>
              <p className="text-primary-700 font-medium">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
