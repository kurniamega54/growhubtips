"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative"
            initial={{ scale: 0.95, y: 40 }}
            animate={{ scale: 1, y: 0, transition: { type: "spring", stiffness: 300 } }}
            exit={{ scale: 0.95, y: 40, opacity: 0 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-forest"
              onClick={onClose}
              aria-label="Close search"
            >
              <X size={22} />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <Search className="text-forest" size={20} />
              <input
                ref={ref}
                className="flex-1 outline-none text-lg bg-transparent"
                placeholder="Search plant tips..."
                aria-label="Search plant tips"
              />
            </div>
            {/* نتائج البحث أو اقتراحات */}
            <div className="text-gray-500 text-sm">Type to search for plant tips, articles, or categories...</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
