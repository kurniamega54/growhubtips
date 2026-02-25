export function NewsletterCTA() {
  return (
    <section className="py-16 md:py-20 bg-primary-100">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-700 mb-4">
          Get Weekly Tips in Your Inbox
        </h2>
        <p className="text-primary-600 mb-8">
          Join 10,000+ gardeners. No spam—just practical tips every Tuesday.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" autoComplete="off">
          <input
            type="email"
            placeholder="your@email.com"
            aria-label="Email for newsletter"
            className="flex-1 px-4 py-3 rounded-xl border-2 border-primary-200 focus:border-primary-500 focus:outline-none text-primary-800"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-accent-500 text-white font-bold rounded-xl hover:bg-accent-600 transition-colors"
          >
            Join Free
          </button>
        </form>
      </div>
    </section>
  );
}
