"use client";
import { useState } from "react";
import { Home, FileText, Image as ImageIcon, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const NAV = [
  { label: "Dashboard", icon: Home, href: "/admin" },
  { label: "All Posts", icon: FileText, href: "/admin/all-posts" },
  { label: "Media", icon: ImageIcon, href: "/admin/media" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(true);
  return (
    <aside
      className={`row-span-2 flex flex-col h-full bg-[#2D5A27] text-white transition-all duration-300 shadow-organic z-20 ${open ? "w-[260px]" : "w-[80px]"}`}
    >
      <div className="flex items-center justify-between px-4 py-6">
        <span className={`font-heading text-xl font-bold tracking-tight transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0 w-0"}`}>GrowHubTips</span>
        <button
          className="ml-auto p-2 rounded hover:bg-[#254a20]/30 transition"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle sidebar"
        >
          {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      <nav className="flex-1 flex flex-col gap-2 mt-4">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-[#254a20]/40 transition text-base font-medium"
          >
            <item.icon size={22} className="shrink-0" />
            <span className={`transition-all duration-200 ${open ? "opacity-100" : "opacity-0 w-0"}`}>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
