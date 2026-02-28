"use client";
import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Menu, Search } from "lucide-react";
import { useScrollDirection } from "../hooks/useScrollDirection";
import { CommandPalette } from "./CommandPalette";
import { MobileMenu } from "./MobileMenu";
import { ActiveLink } from "./ActiveLink";

interface CategoryLink {
  id: string;
  name: string;
  slug: string;
}

// start with home link; category links will be loaded dynamically
const baseLinks = [{ href: "/", label: "Home" }];


export function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [showCmd, setShowCmd] = useState(false);
  const scrollDir = useScrollDirection();
  const [scrolled, setScrolled] = useState(false);
  const controls = useAnimation();

  const [categories, setCategories] = useState<CategoryLink[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => setCategories([]));
  }, []);

  // Show/hide navbar on scroll
  useEffect(() => {
    controls.start({
      y: scrollDir === "down" ? -80 : 0,
      boxShadow: scrolled ? "0 2px 24px 0 rgba(45,90,39,0.08)" : "0 0px 0px 0 rgba(0,0,0,0)",
      transition: { type: "spring", stiffness: 400, damping: 30 },
    });
  }, [scrollDir, scrolled, controls]);

  // Add shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard shortcut for Command Palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowCmd(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={controls}
        className={
          "sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3 flex items-center justify-between transition-colors duration-200" +
          (scrolled ? " shadow-lg" : "")
        }
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="GrowHubTips Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-forest">GrowHubTips</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {baseLinks.concat(
            categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name }))
          ).map((link) => (
            <ActiveLink key={link.href} href={link.href}>{link.label}</ActiveLink>
          ))}
          {/* Search Bar */}
          <button
            className="ml-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage/20 border border-sage/30 text-forest hover:bg-sage/40 transition focus:outline-none focus:ring-2 focus:ring-sage"
            onClick={() => setShowCmd(true)}
            aria-label="Open search (Cmd+K)"
            type="button"
          >
            <Search size={18} />
            <span className="text-sm text-forest/70">Search tips...</span>
            <kbd className="ml-2 px-2 py-0.5 rounded bg-forest/10 text-xs text-forest border border-forest/20">Cmd+K</kbd>
          </button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2">
          <button
            className="p-2 rounded-full bg-sage/20 text-forest hover:bg-sage/40 focus:outline-none focus:ring-2 focus:ring-sage"
            onClick={() => setShowMenu(true)}
            aria-label="Open menu"
            type="button"
          >
            <Menu size={28} />
          </button>
        </div>
      </motion.nav>
      <MobileMenu open={showMenu} onClose={() => setShowMenu(false)} />
      <CommandPalette open={showCmd} onClose={() => setShowCmd(false)} />
    </>
  );
}
