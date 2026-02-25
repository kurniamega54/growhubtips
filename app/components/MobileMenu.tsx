"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Leaf, Facebook, Twitter, Instagram } from "lucide-react";
import { ReactNode } from "react";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/plants", label: "Plants" },
  { href: "/vegetables", label: "Vegetables" },
  { href: "/troubleshooting", label: "Troubleshooting" },
  { href: "/about", label: "About" },
];

export function MobileMenu({ open, onClose, children }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] bg-[#F9F9F9]/95 backdrop-blur-lg flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            className="absolute top-6 right-6 text-forest hover:text-sage"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={32} />
          </button>
          <nav className="flex flex-col items-center justify-center flex-1 gap-8 mt-24">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-2xl font-bold text-forest hover:text-sage"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 300 }}
                tabIndex={0}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>
          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook"><Facebook className="text-forest hover:text-sage" /></a>
              <a href="#" aria-label="Twitter"><Twitter className="text-forest hover:text-sage" /></a>
              <a href="#" aria-label="Instagram"><Instagram className="text-forest hover:text-sage" /></a>
            </div>
            <div className="bg-sage/20 rounded-xl px-4 py-2 text-center text-forest text-sm font-medium shadow">
              <Leaf className="inline-block mr-1 text-sage" size={18} />
              Gardening Tip of the Day: Water early in the morning for best results!
            </div>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
