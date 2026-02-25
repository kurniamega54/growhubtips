const testimonials = [
  {
    quote: "My Monstera was dying. Within a week of following the tips, it's thriving!",
    author: "Sarah M.",
    role: "Urban Gardener",
  },
  {
    quote: "Finally, plant advice that actually works. Saved my herb garden twice!",
    author: "James L.",
    role: "Beginner",
  },
  {
    quote: "The Plant Doctor section diagnosed my issue in seconds. Game changer.",
    author: "Elena K.",
    role: "Indoor Plant Enthusiast",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-20 bg-primary-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-700 text-center mb-4">
          Loved by Gardeners Everywhere
        </h2>
        <p className="text-primary-600 text-center max-w-2xl mx-auto mb-12">
          Join thousands who&apos;ve transformed their spaces with our tips.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <blockquote
              key={t.author}
              className="bg-white p-6 rounded-2xl shadow-organic border border-primary-100"
            >
              <p className="text-primary-700 mb-4">&ldquo;{t.quote}&rdquo;</p>
              <footer>
                <cite className="not-italic font-bold text-primary-700">{t.author}</cite>
                <span className="text-primary-500 text-sm block">{t.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
