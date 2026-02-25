import { HeroSection } from "./components/HeroSection";
import { CategoryGrid } from "./components/CategoryGrid";
import { FeaturedArticles } from "./components/FeaturedArticles";
import { TrustSignals } from "./components/TrustSignals";
import { HowItWorks } from "./components/HowItWorks";
import { Testimonials } from "./components/Testimonials";
import { QuickTips } from "./components/QuickTips";
import { SeasonalSection } from "./components/SeasonalSection";
import { NewsletterCTA } from "./components/NewsletterCTA";
import { FAQ } from "./components/FAQ";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F9F9F9] font-sans">
      <HeroSection />

      <section className="py-12 md:py-16 max-w-6xl mx-auto px-4" aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="sr-only">Browse by Category</h2>
        <CategoryGrid />
      </section>

      <section className="py-12 md:py-16 max-w-6xl mx-auto px-4">
        <FeaturedArticles />
      </section>

      <section className="py-12 md:py-16 max-w-6xl mx-auto px-4">
        <TrustSignals />
      </section>

      <HowItWorks />
      <Testimonials />
      <QuickTips />
      <SeasonalSection />
      <NewsletterCTA />
      <FAQ />
    </main>
  );
}
