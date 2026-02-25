"use client";

import { motion } from "framer-motion";

export type SaveStatus = "idle" | "syncing" | "saved" | "offline";

const statusLabels: Record<SaveStatus, string> = {
  idle: "",
  syncing: "Syncing...",
  saved: "Draft Saved",
  offline: "Connection Lost - Saving Locally",
};

export function StatusManager({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;

  if (status === "syncing") {
    return (
      <div className="flex items-center gap-2 text-sm text-accent-600">
        <motion.span
          className="inline-flex h-3 w-3 rounded-full border-2 border-accent-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          aria-hidden
        />
        <span>{statusLabels[status]}</span>
      </div>
    );
  }

  const isOffline = status === "offline";

  return (
    <div
      className={`flex items-center gap-2 text-sm ${
        isOffline ? "text-accent-600" : "text-secondary-500"
      }`}
    >
      <motion.span
        className={`inline-flex h-2.5 w-2.5 rounded-full ${
          isOffline ? "bg-accent-500" : "bg-secondary-400"
        }`}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <span>{statusLabels[status]}</span>
    </div>
  );
}
