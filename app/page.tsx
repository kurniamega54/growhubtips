import { HeroSection } from "@/app/components/HeroSection";
import { CategoryGrid } from "@/app/components/CategoryGrid";
import { FeaturedArticles } from "@/app/components/FeaturedArticles";
import { TrustSignals } from "@/app/components/TrustSignals";
import { HowItWorks } from "@/app/components/HowItWorks";
import { Testimonials } from "@/app/components/Testimonials";
import { QuickTips } from "@/app/components/QuickTips";
import { SeasonalSection } from "@/app/components/SeasonalSection";
import { NewsletterCTA } from "@/app/components/NewsletterCTA";
import { FAQ } from "@/app/components/FAQ";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
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
      <Footer />
    </>
  );
}
