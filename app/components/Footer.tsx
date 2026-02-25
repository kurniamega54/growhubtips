"use client";
import { motion, AnimatePresence } from "framer-motion";
 import { Instagram, Youtube, ArrowUp } from "lucide-react";
import clsx from "clsx";
import { useState, useEffect } from "react";

const gardeningLinks = [
  { href: "/indoor-plants", label: "Indoor Plants" },
  { href: "/vegetable-gardening", label: "Vegetable Gardening" },
  { href: "/succulent-care", label: "Succulent Care" },
  { href: "/plant-doctor", label: "Plant Doctor" },
];
const resourceLinks = [
  { href: "/about", label: "About Our Mission" },
  { href: "/contact", label: "Contact Expert Support" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/affiliate", label: "Affiliate Disclosure" },
];
const trustBadges = [
  { icon: "🌱", label: "100% Organic Advice" },
  { icon: "✅", label: "Expert Verified Content" },
  { icon: "🏆", label: "Member of Gardening Association" },
];

export function Footer() {
  const [showTop, setShowTop] = useState(false);
  const year = new Date().getFullYear();
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 120);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <footer className="relative z-40 bg-primary-500 text-white pt-16 pb-8 overflow-hidden">
      <motion.div
        className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
      >
        {/* Column 1: Brand */}
        <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}>
          <div className="mb-4 flex items-center gap-2">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="18" cy="18" rx="16" ry="16" fill="#2D5A27" />
                <path d="M18 8c3.5 0 6 2.5 6 6 0 3.5-2.5 6-6 6s-6-2.5-6-6c0-3.5 2.5-6 6-6z" fill="#8E9775" />
                <text x="18" y="22" textAnchor="middle" fontSize="10" fill="#fff" fontFamily="Playfair Display">G</text>
              </svg>
            </div>
          </div>
          <div className="font-heading text-xl font-bold mb-2 leading-tight text-white">Empowering Urban Gardeners</div>
          <div className="text-sm mb-4 text-white">GrowHubTips helps you nurture your green thumb and thrive in any space.</div>
          <div className="flex gap-4 mt-2">
            {[Instagram, Youtube].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                aria-label={Icon.name}
                whileHover={{ scale: 1.18, y: -4 }}
                className="bg-white rounded-full p-2 text-primary-500 hover:text-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500 shadow"
                tabIndex={0}
                style={{filter:'drop-shadow(0 2px 8px rgba(45,90,39,0.12))'}}
              >
                <Icon size={22} />
              </motion.a>
            ))}
          </div>
        </motion.div>
        {/* Column 2: Gardening Hub */}
        <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}>
          <div className="font-heading text-lg font-semibold mb-4 text-white border-b border-white/20 pb-2">The Gardening Hub</div>
          <ul className="space-y-3">
            {gardeningLinks.map((link) => (
              <li key={link.href}>
                <motion.a
                  href={link.href}
                  className="block text-white font-bold hover:text-accent-500 transition text-base"
                  whileHover={{ x: 5 }}
                  tabIndex={0}
                >
                  {link.label}
                </motion.a>
              </li>
            ))}
          </ul>
        </motion.div>
        {/* Column 3: Resources & Trust */}
        <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}>
          <div className="font-heading text-lg font-semibold mb-4 text-white border-b border-white/20 pb-2">Resources & Trust</div>
          <ul className="space-y-3">
            {resourceLinks.map((link) => (
              <li key={link.href}>
                <motion.a
                  href={link.href}
                  className="block text-white hover:text-accent-500 transition text-base"
                  whileHover={{ x: 5 }}
                  tabIndex={0}
                >
                  {link.label}
                </motion.a>
              </li>
            ))}
          </ul>
        </motion.div>
        {/* Column 4: Newsletter */}
        <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}>
          <div className="font-heading text-lg font-semibold mb-4 text-white border-b border-white/20 pb-2">Join the Hub</div>
          <form className="flex flex-col gap-3 mt-2" autoComplete="off">
            <input
              type="email"
              aria-label="Email for newsletter"
              placeholder="Your email..."
              className="rounded-organic bg-white/30 border border-white/20 px-4 py-2 text-primary-700 placeholder:text-primary-300 focus:outline-none focus:ring-2 focus:ring-accent-500 transition"
            />
            <motion.button
              type="submit"
              className="bg-accent-500 text-white font-bold px-4 py-2 rounded-organic shadow-organic focus:outline-none focus:ring-2 focus:ring-accent-500 transition"
              whileHover={{ scale: 1.06, boxShadow: "0 0 16px #E2725B" }}
            >
              Join the Hub
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
      {/* Authority Badges */}
      <div className="relative max-w-7xl mx-auto mt-10 flex flex-wrap justify-center gap-6 px-6">
        {trustBadges.map((badge, i) => (
          <div key={i} className="flex items-center gap-2 bg-white/10 rounded-organic px-4 py-2 text-white text-sm font-medium">
            <span className="text-2xl grayscale">{badge.icon}</span>
            <span>{badge.label}</span>
          </div>
        ))}
      </div>
      {/* Copyright & Back to Top */}
      <div className="relative max-w-7xl mx-auto mt-8 flex items-center justify-between px-6">
        <div className="text-xs text-white/70">© {year} GrowHubTips. All rights reserved.</div>
        <AnimatePresence>
          {showTop && (
            <button
              className="flex items-center gap-2 bg-accent-500 text-white px-3 py-2 rounded-organic shadow-organic focus:outline-none focus:ring-2 focus:ring-accent-500 transition"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
            >
              <ArrowUp size={18} />
              <span className="relative">
                Back to Top
                <span className="absolute left-0 bottom-[-6px] w-full h-[3px] bg-accent-500 rounded-full animate-grow-vine" />
              </span>
            </button>
          )}
        </AnimatePresence>
      </div>
      {/* Vine Animation */}
      <style>{`
        @keyframes grow-vine { 0% { width: 0; } 100% { width: 100%; } }
        .animate-grow-vine { animation: grow-vine 0.6s ease; }
      `}</style>
    </footer>
  );
}
