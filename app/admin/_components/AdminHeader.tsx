"use client";
import { useContext } from "react";
import EditorContext, { EditorContextType } from "./EditorContext";
import { motion } from "framer-motion";

export default function AdminHeader() {
  const context = useContext(EditorContext) as EditorContextType;
  if (!context) return null;
  const { title, setTitle, syncStatus, onPublish, onPreview } = context;
  return (
    <header className="sticky top-0 z-30 bg-[#F1F3F0] flex items-center justify-between px-8 py-4 border-b border-gray-100 shadow-organic">
      <div className="flex items-center gap-4 min-w-0">
        <span className="text-xs text-gray-500">Admin &gt; New Post</span>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="bg-transparent text-2xl md:text-3xl font-heading font-bold border-none outline-none px-2 py-1 min-w-0 flex-1"
          placeholder="Document Title"
          style={{ minWidth: 0 }}
        />
      </div>
      <div className="flex-1 flex justify-center">
        <motion.span
          key={syncStatus}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-sm font-medium text-primary-500"
        >
          {syncStatus}
        </motion.span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onPreview}
          className="px-5 py-2 rounded-lg bg-white border border-primary-200 text-primary-700 font-semibold hover:bg-primary-50 transition"
        >
          Preview
        </button>
        <button
          onClick={onPublish}
          className="px-6 py-2 rounded-lg bg-[#D96C32] text-white font-bold shadow-organic hover:bg-[#b85a28] transition"
        >
          Publish
        </button>
      </div>
    </header>
  );
}
