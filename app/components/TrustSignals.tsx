const stats = [
  { label: "Tips Shared", value: "2,500+" },
  { label: "Active Members", value: "1,200+" },
  { label: "Plants Saved", value: "800+" },
  { label: "Articles", value: "150+" },
];

export function TrustSignals() {
  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-12 py-8 px-6 bg-white rounded-2xl shadow-organic border border-primary-100">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <span className="block text-3xl md:text-4xl font-bold text-primary-500">{stat.value}</span>
          <span className="text-primary-600 mt-1">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
