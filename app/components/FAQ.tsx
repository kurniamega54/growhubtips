const faqs = [
  {
    q: "How often should I water my plants?",
    a: "It depends on the plant, pot size, and light. A rule of thumb: water when the top 2 inches of soil feel dry. Succulents need less; ferns need more.",
  },
  {
    q: "Why are my plant leaves turning yellow?",
    a: "Common causes: overwatering, poor drainage, low light, or natural aging. Check soil moisture first—overwatering is the #1 killer.",
  },
  {
    q: "Can I grow vegetables indoors?",
    a: "Yes! Herbs, microgreens, and compact veggies like cherry tomatoes thrive with bright light (or grow lights). Start with basil or lettuce.",
  },
  {
    q: "What's the best soil for houseplants?",
    a: "Use a well-draining potting mix—never garden soil. Add perlite for aeration. Succulents need cactus mix.",
  },
];

export function FAQ() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-700 text-center mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-primary-600 text-center mb-12">
          Quick answers to the most common gardening questions.
        </p>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border-2 border-primary-100 overflow-hidden bg-white"
            >
              <summary className="px-6 py-4 font-bold text-primary-700 cursor-pointer list-none flex justify-between items-center hover:bg-primary-50 transition-colors [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 py-4 bg-primary-50 text-primary-700 border-t border-primary-100">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
