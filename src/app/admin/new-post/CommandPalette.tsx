"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle } from "lucide-react";
import { computePosition, flip, shift, offset } from "@floating-ui/dom";
import type { CommandItem } from "@/src/lib/editor/commands/commands";
import { fuzzySearch } from "@/src/lib/utils/fuzzySearch";

interface CommandPaletteProps {
  items: CommandItem[];
  selectedIndex: number;
  onSelect: (item: CommandItem) => void;
  query: string;
  position: { top: number; left: number } | null;
}

const FOREST_GREEN = "#2D5A27";
const STAGGER_DELAY = 0.15; // Stagger effect timing

export function CommandPalette({
  items,
  selectedIndex,
  onSelect,
  query,
  position,
}: CommandPaletteProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const [floatingPosition, setFloatingPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  // Calculate smart position using Floating UI
  useEffect(() => {
    if (!position || !floatingRef.current) return;

    // Create virtual reference element
    const virtualReference = {
      getBoundingClientRect: () => ({
        top: position.top,
        left: position.left,
        bottom: position.top,
        right: position.left,
        width: 0,
        height: 0,
        x: position.left,
        y: position.top,
        toJSON: () => ({}),
      }),
    };

    // Compute position with middleware
    computePosition(virtualReference as any, floatingRef.current, {
      placement: "bottom-start",
      middleware: [
        offset(12),
        flip({ padding: 20 }),
        shift({ padding: 20 }),
      ],
    }).then(({ x, y }) => {
      setFloatingPosition({ x, y });
    });
  }, [position]);

  // Fuzzy search results
  const results = fuzzySearch(
    query,
    items.map((item) => ({
      ...item,
      id: item.id,
      label: item.label,
      searchText: item.searchText,
    }))
  );

  // Auto-scroll selected item into view
  useEffect(() => {
    const selectedElement = scrollRef.current?.children[selectedIndex];
    if (selectedElement && scrollRef.current) {
      selectedElement.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  // Show "no results" when palette is open but no search results
  if (position && results.length === 0) {
    return (
      <AnimatePresence>
        <motion.div
          ref={floatingRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            position: "fixed",
            left: `${floatingPosition.x}px`,
            top: `${floatingPosition.y}px`,
            zIndex: 50,
          }}
          className="w-80 rounded-lg border border-gray-200 bg-white shadow-2xl"
        >
          <div className="p-8 text-center">
            <AlertCircle
              className="h-12 w-12 mx-auto mb-3"
              style={{ color: FOREST_GREEN }}
              strokeWidth={1.5}
            />
            <p className="text-sm font-semibold" style={{ color: FOREST_GREEN }}>
              No results found
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Try searching for a different command
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Hide palette when no position or no results
  if (!position || results.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={floatingRef}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 25,
          mass: 1,
        }}
        style={{
          position: "fixed",
          left: `${floatingPosition.x}px`,
          top: `${floatingPosition.y}px`,
          zIndex: 50,
        }}
        className="w-80 rounded-lg bg-white shadow-2xl overflow-hidden border border-gray-100"
      >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.2 }}
            className="px-4 py-3 border-b border-gray-100 bg-gradient-to-b from-white to-gray-50/50"
          >
            <div className="flex items-center justify-between">
              <p
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: FOREST_GREEN }}
              >
                Insert Block
              </p>
              <span className="text-xs text-gray-400 font-medium">
                {results.length} result{results.length !== 1 ? "s" : ""}
              </span>
            </div>
          </motion.div>

          {/* Results List */}
          <div
            ref={scrollRef}
            className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          >
            <AnimatePresence>
              {results.map((result, index) => {
                const Icon = result.item.icon;
                const isSelected = index === selectedIndex;

                return (
                  <motion.button
                    key={result.item.id}
                    onClick={() => onSelect(result.item)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{
                      delay: index * STAGGER_DELAY,
                      duration: 0.3,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className="w-full px-4 py-3 flex items-start gap-3 cursor-pointer transition-all text-left relative group"
                    whileHover={{ x: 6 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Background highlight */}
                    <motion.div
                      className="absolute inset-0 -z-10"
                      animate={{
                        backgroundColor: isSelected
                          ? "rgba(45, 90, 39, 0.08)"
                          : "transparent",
                      }}
                      transition={{ duration: 0.2 }}
                    />

                    {/* Left border indicator */}
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1"
                      animate={{
                        backgroundColor: isSelected
                          ? FOREST_GREEN
                          : "transparent",
                      }}
                      transition={{ duration: 0.2 }}
                    />

                    {/* Icon */}
                    <motion.div
                      className="mt-1 flex-shrink-0"
                      animate={{
                        color: isSelected ? FOREST_GREEN : FOREST_GREEN,
                        opacity: isSelected ? 1 : 0.7,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon size={18} strokeWidth={2.2} />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <motion.p
                        className="text-sm font-bold truncate"
                        animate={{
                          color: isSelected ? FOREST_GREEN : "#1a1a1a",
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {result.item.label}
                      </motion.p>
                      <motion.p
                        className="text-xs text-gray-600 line-clamp-2 mt-0.5"
                        animate={{
                          opacity: isSelected ? 1 : 0.7,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {result.item.description}
                      </motion.p>

                      {/* Score visualization */}
                      {result.score > 0 && (
                        <motion.div
                          className="mt-2 flex items-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.6 }}
                          transition={{ delay: index * STAGGER_DELAY + 0.1 }}
                        >
                          <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.min(result.score / 20, 100)}%`,
                              }}
                              transition={{
                                delay: index * STAGGER_DELAY + 0.15,
                                duration: 0.4,
                              }}
                              className="h-full rounded-full"
                              style={{
                                backgroundColor: FOREST_GREEN,
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 font-medium w-6 text-right">
                            {Math.round(result.score)}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Footer - Keyboard hints */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="px-4 py-2 border-t border-gray-100 bg-gradient-to-t from-white to-gray-50/50"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex gap-2">
                <motion.kbd
                  className="px-2 py-1 rounded bg-white border border-gray-200 font-mono font-medium"
                  style={{ color: FOREST_GREEN }}
                  whileHover={{ scale: 1.05 }}
                >
                  ↑↓
                </motion.kbd>
                <motion.kbd
                  className="px-2 py-1 rounded bg-white border border-gray-200 font-mono font-medium"
                  style={{ color: FOREST_GREEN }}
                  whileHover={{ scale: 1.05 }}
                >
                  ↵
                </motion.kbd>
              </div>
              <span className="text-gray-500">Navigate & Select</span>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
  );
}
