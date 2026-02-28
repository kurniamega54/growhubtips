"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BlockSuggestion } from "@/src/lib/editor/suggestions";

type SlashMenuProps = {
  items: BlockSuggestion[];
  command: (item: BlockSuggestion) => void;
  clientRect?: (() => DOMRect) | null;
  onClose?: () => void;
};

export default function SlashMenu({ items, command, clientRect, onClose }: SlashMenuProps) {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    setSelected(0);
  }, [items]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, Math.max(0, items.length - 1)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = items[selected];
        if (item) command(item);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items, selected, command, onClose]);

  if (!items || items.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 6 }}
        className="w-80 bg-white rounded-2xl border border-primary-200 shadow-organic overflow-hidden z-50"
      >
        <div className="px-3 py-2 text-xs font-semibold text-primary-600 bg-primary-50">
          Block Commands (type to filter)
        </div>
        <div className="max-h-64 overflow-auto">
          {items.map((item, idx) => (
            <button
              key={item.type}
              type="button"
              onClick={() => command(item)}
              onMouseEnter={() => setSelected(idx)}
              className={`w-full flex items-start gap-3 px-4 py-2.5 text-left transition ${idx === selected ? "bg-primary-50" : ""}`}
            >
              <div className="text-lg">{item.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-neutral-700 truncate">{item.label}</div>
                <div className="text-xs text-neutral-500 truncate">{item.description}</div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
