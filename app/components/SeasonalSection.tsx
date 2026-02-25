const seasons = [
  { name: "Spring", icon: "🌸", focus: "Planting, pruning, fertilizing" },
  { name: "Summer", icon: "☀️", focus: "Watering, pest control, harvesting" },
  { name: "Fall", icon: "🍂", focus: "Prep for winter, bulb planting" },
  { name: "Winter", icon: "❄️", focus: "Indoor care, planning next season" },
];

export function SeasonalSection() {
  return (
    <section className="py-16 md:py-20 bg-primary-500 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-4">
          Seasonal Gardening Guide
        </h2>
        <p className="text-white/90 text-center max-w-2xl mx-auto mb-12">
          Know exactly what to do each season for your best harvest yet.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {seasons.map((s) => (
            <div
              key={s.name}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-colors text-center"
            >
              <span className="text-4xl block mb-2" aria-hidden>{s.icon}</span>
              <h3 className="font-bold text-lg mb-1">{s.name}</h3>
              <p className="text-sm text-white/80">{s.focus}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
