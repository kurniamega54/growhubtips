"use client";

/**
 * Admin Workspace - The Complete Editor Interface
 * Three-panel layout with top management bar
 * Professional, zero-distraction writing environment
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Eye, Send, Loader2 } from "lucide-react";
import { NewPostForm } from "./NewPostForm";
import AdminSidebar from "../_components/AdminSidebar";

interface AdminWorkspaceProps {
  categories: { id: string; name: string; slug: string }[];
}

export function AdminWorkspace({ categories }: AdminWorkspaceProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [syncStatus, setSyncStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-full w-full flex flex-col bg-[#F1F3F0]">
      {/* TOP MANAGEMENT BAR */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0 bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-40"
      >
        <div className="h-16 flex items-center justify-between px-6 gap-6">
          {/* Left: Breadcrumbs & Sidebar Toggle */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition text-neutral-600"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
            <div className="text-sm text-neutral-500 flex items-center gap-2">
              <span>Admin</span>
              <span className="text-neutral-300">/</span>
              <span className="text-neutral-700 font-medium">New Post</span>
            </div>
          </div>

          {/* Center: Sync Status */}
          <div className="flex-1 flex justify-center">
            <motion.div
              key={syncStatus}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg ${
                syncStatus === "saving"
                  ? "bg-blue-50 text-blue-600"
                  : syncStatus === "saved"
                  ? "bg-green-50 text-green-600"
                  : "bg-neutral-50 text-neutral-500"
              }`}
            >
              {syncStatus === "saving" && <Loader2 className="w-4 h-4 animate-spin" />}
              {syncStatus === "saved" && <span>✓</span>}
              {syncStatus === "idle" && <span>🍃</span>}
              <span>
                {syncStatus === "saving"
                  ? "Saving..."
                  : syncStatus === "saved"
                  ? "All changes saved"
                  : "Draft saved"}
              </span>
            </motion.div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-medium transition"
            >
              <Eye size={18} />
              <span className="hidden sm:inline">Preview</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-[#2D5A27] to-[#3D7A37] hover:from-[#1F4620] hover:to-[#2D5A27] text-white font-medium transition shadow-sm"
            >
              <Send size={18} />
              <span className="hidden sm:inline">Publish</span>
              <span className="sm:hidden">Pub</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* MAIN WORKSPACE GRID */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR - Navigation */}
        {(sidebarOpen || !isMobile) && (
          <motion.aside
            initial={{ x: isMobile ? -260 : 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`${
              isMobile ? "absolute left-0 top-16 h-[calc(100%-4rem)] z-30" : "relative"
            } bg-[#2D5A27] text-white flex flex-col w-64 border-r border-[#1F4620]/50 shadow-lg`}
          >
            <AdminSidebar />
          </motion.aside>
        )}

        {/* CENTRAL CANVAS - Editor & SEO Panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex-1 flex overflow-hidden"
        >
          {/* Editor Form */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-8">
              <NewPostForm categories={categories} onSyncStatusChange={setSyncStatus} />
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDEBAR - SEO Analytics (Desktop only) */}
        {!isMobile && (
          <motion.aside
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex-shrink-0 w-80 bg-white border-l border-neutral-200 overflow-y-auto shadow-sm"
          >
            <div className="p-6 border-b border-neutral-100 sticky top-0 bg-white/95 backdrop-blur">
              <h3 className="text-lg font-semibold text-[#2D5A27]">SEO Analyzer</h3>
              <p className="text-xs text-neutral-500 mt-1">Real-time optimization</p>
            </div>

            {/* SEO Metrics Cards */}
            <div className="p-4 space-y-4">
              {/* Placeholder SEO cards */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-900">SEO Score</span>
                  <span className="text-2xl font-bold text-green-600">--/100</span>
                </div>
                <div className="w-full h-2 bg-green-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 w-0"></div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 p-2 rounded hover:bg-neutral-50">
                  <span className="text-neutral-400">•</span>
                  <span className="text-neutral-600">Readability: Analyzing...</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded hover:bg-neutral-50">
                  <span className="text-neutral-400">•</span>
                  <span className="text-neutral-600">Keywords: Analyzing...</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded hover:bg-neutral-50">
                  <span className="text-neutral-400">•</span>
                  <span className="text-neutral-600">Meta tags: Analyzing...</span>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </div>

      {/* Mobile Overlay for Sidebar */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="absolute inset-0 bg-black/50 z-20"
        />
      )}
    </div>
  );
}
