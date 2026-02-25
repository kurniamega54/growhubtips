import { SearchBar } from "./SearchBar";

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-primary-50 to-[#F9F9F9] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary-200/30 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-secondary-400/20 blur-3xl" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <p className="text-primary-600 font-medium mb-2">Expert gardening tips for every space</p>
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-700 mb-4 leading-tight">
          Nurturing Your Green Thumb, One Tip at a Time
        </h1>
        <p className="text-primary-600 text-lg mb-8 max-w-2xl mx-auto">
          From houseplants to veggies—find clear, actionable advice that actually works.
        </p>
        <SearchBar />
      </div>
    </section>
  );
}
