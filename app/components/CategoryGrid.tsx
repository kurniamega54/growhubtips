import Link from "next/link";

const categories = [
  { name: "Houseplants", icon: "🌿", href: "/plants", color: "bg-secondary-400" },
  { name: "Vegetables", icon: "🥕", href: "/vegetables", color: "bg-primary-500" },
  { name: "Herbs", icon: "🌱", href: "/herbs", color: "bg-neutral-500" },
  { name: "Plant Doctor", icon: "🩺", href: "/plant-doctor", color: "bg-secondary-400" },
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((cat) => (
        <Link
          key={cat.name}
          href={cat.href}
          className={`flex flex-col items-center justify-center p-8 rounded-2xl shadow-organic ${cat.color} text-white hover:scale-[1.02] hover:shadow-lg transition-all duration-200`}
        >
          <span className="text-4xl mb-3 block" aria-hidden>{cat.icon}</span>
          <span className="text-lg font-bold">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}
