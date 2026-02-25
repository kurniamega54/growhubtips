const steps = [
  { icon: "🔍", title: "Find Your Plant", desc: "Search our database or browse categories." },
  { icon: "📖", title: "Get Expert Tips", desc: "Clear, actionable advice from gardening pros." },
  { icon: "🌱", title: "Grow Confidently", desc: "Track progress and troubleshoot issues." },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-700 text-center mb-4">
          How GrowHubTips Works
        </h2>
        <p className="text-primary-600 text-center max-w-2xl mx-auto mb-12">
          Your journey from plant parent novice to confident gardener in three simple steps.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="text-center p-6 rounded-2xl bg-primary-50 border border-primary-100 hover:shadow-organic transition-shadow"
            >
              <span className="text-4xl md:text-5xl block mb-4" aria-hidden>{step.icon}</span>
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-500 text-white text-sm font-bold mb-4">
                {i + 1}
              </span>
              <h3 className="text-xl font-bold text-primary-700 mb-2">{step.title}</h3>
              <p className="text-primary-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
