"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NewPostForm } from "./NewPostForm";
import { SeoSidebar } from "./SeoSidebar";
import { EditorProvider, EditorContext } from "../_components/EditorContext";
import { useContext } from "react";
import { Eye, Save } from "lucide-react";

const SAGE_BG = "#F1F3F0";
const TERRACOTTA = "#E07A5F";

function LeftSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className="bg-[rgba(45,90,39,0.06)] border-r border-gray-100 h-full flex flex-col"
    >
      <div className="p-3 flex-1">
        <button
          onClick={onToggle}
          className="text-sm text-forest flex items-center gap-2 rounded px-2 py-3 w-full"
        >
          {collapsed ? "≡" : "≡ Collapse"}
        </button>
        <nav className="mt-6 space-y-2">
          <a className="block p-2 rounded hover:bg-white">Dashboard</a>
          <a className="block p-2 rounded hover:bg-white">All Posts</a>
          <a className="block p-2 rounded hover:bg-white">Media</a>
          <a className="block p-2 rounded hover:bg-white">Settings</a>
        </nav>
      </div>
      <div className="p-3 text-xs text-gray-400">GrowHubTips</div>
    </motion.aside>
  );
}

function TopBar({ title, setTitle, syncStatus, onPublish, onPreview }: any) {
  return (
    <header className="sticky top-0 z-20 bg-transparent backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="flex-1 flex items-center gap-4">
          <div className="text-sm text-gray-500">Admin › New Post</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className="text-2xl font-semibold bg-transparent outline-none"
          />
        </div>

        <div className="flex-1 flex justify-center">
          <div className="text-sm">{syncStatus}</div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onPreview}
            className="px-3 py-2 rounded border border-gray-200 text-sm flex items-center gap-2"
          >
            <Eye size={16} /> Preview
          </button>
          <button
            onClick={onPublish}
            style={{ background: TERRACOTTA }}
            className="text-white px-4 py-2 rounded shadow-sm flex items-center gap-2"
          >
            Publish
          </button>
        </div>
      </div>
    </header>
  );
}

export default function AdminWorkspaceClient({ categories }: { categories: { id: string; name: string; slug: string }[] }) {
  const [collapsed, setCollapsed] = useState(false);
  const [seoOpen, setSeoOpen] = useState(true);
  const [title, setTitle] = useState("");
  const [syncStatus, setSyncStatus] = useState("🍃 Draft Saved");

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 220);
    return () => clearTimeout(t);
  }, []);

  const handlePublish = () => {
    setSyncStatus("🔄 Publishing...");
    setTimeout(() => setSyncStatus("✅ Published"), 1200);
  };

  const handlePreview = () => {
    window.open("/", "_blank");
  };

  return (
    <EditorProvider>
      <div className="h-screen w-full flex flex-col bg-[rgba(241,243,240,1)]">
        <TopBar title={title} setTitle={setTitle} syncStatus={syncStatus} onPublish={handlePublish} onPreview={handlePreview} />

        <div className="flex-1 flex overflow-hidden">
          <LeftSidebar collapsed={collapsed} onToggle={() => setCollapsed((s) => !s)} />

          <main className="flex-1 overflow-auto" style={{ background: SAGE_BG }}>
            <div className="max-w-5xl mx-auto p-8">
              <AnimatePresence>
                {loading ? (
                  <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="rounded-lg bg-white p-8 shadow-[0_10px_30px_rgba(45,90,39,0.06)]">
                      <div className="h-8 w-3/5 bg-gray-100 rounded mb-6" />
                      <div className="space-y-4">
                        <div className="h-4 bg-gray-100 rounded" />
                        <div className="h-4 bg-gray-100 rounded" />
                        <div className="h-4 bg-gray-100 rounded" />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="editor" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}>
                    <div className="rounded-lg bg-white p-8 shadow-[0_20px_40px_rgba(45,90,39,0.08)]">
                      <NewPostForm onSyncStatusChange={(s: string) => setSyncStatus(s)} categories={categories} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>

          <aside className="w-[320px] border-l border-gray-100 bg-white">
            <div className="p-4 h-full">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">SEO Engine</h4>
                <button onClick={() => setSeoOpen((s) => !s)} className="text-sm text-gray-500">
                  {seoOpen ? "Hide" : "Show"}
                </button>
              </div>

              <AnimatePresence>
                {seoOpen && (
                  <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 40, opacity: 0 }} transition={{ staggerChildren: 0.06 }} className="mt-4 space-y-4">
                    {(() => {
                      const ctx = useContext(EditorContext);
                      return (
                        <SeoSidebar
                          title={ctx?.title ?? ""}
                          slug={""}
                          focusKeyword={""}
                          seoTitle={ctx?.title ?? ""}
                          metaDescription={""}
                          contentJson={ctx?.contentJson}
                          isSaving={false}
                          lastSavedAt={null}
                          onSeoScoreChange={ctx?.setSeoScore}
                        />
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>
        </div>
      </div>
    </EditorProvider>
  );
}
