"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Image as ImgIcon, Trash, CheckCircle } from "lucide-react";
import Image from "next/image";

type MediaItem = {
  id: string;
  url: string;
  key?: string;
  name?: string;
  file_type?: string;
  file_size?: number;
  width?: number | null;
  height?: number | null;
  alt_text?: string | null;
  caption?: string | null;
  title?: string | null;
  created_at?: string;
};

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [drawerItem, setDrawerItem] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  const filtered = items.filter((it) => {
    if (filter !== "all") {
      if (filter === "image" && !(it.file_type || "").startsWith("image")) return false;
      if (filter === "video" && !(it.file_type || "").startsWith("video")) return false;
      if (filter === "doc" && (it.file_type || "").startsWith("image")) return false;
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      return (it.name || "").toLowerCase().includes(q) || (it.alt_text || "").toLowerCase().includes(q);
    }
    return true;
  });

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/media", { method: "POST", body: fd });
        const json = await res.json();
        if (json.item) setItems((s) => [json.item, ...s]);
      } catch (e) {
        console.error(e);
      }
    }
    setUploading(false);
  }

  async function handleBulkDelete() {
    const ids = Object.keys(selected).filter((k) => selected[k]);
    if (!ids.length) return;
    if (!confirm(`Delete ${ids.length} items?`)) return;
    for (const id of ids) {
      try {
        await fetch(`/api/media/${id}`, { method: "DELETE" });
        setItems((s) => s.filter((it) => it.id !== id));
      } catch (e) {
        console.error(e);
      }
    }
    setSelected({});
  }

  return (
    <div className="p-6 h-full flex flex-col bg-[rgba(241,243,240,1)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Media Hub</h2>
        <div className="flex items-center gap-2">
          <input placeholder="Search alt text or name" value={query} onChange={(e) => setQuery(e.target.value)} className="px-3 py-2 rounded border" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 rounded border">
            <option value="all">All</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="doc">Docs</option>
          </select>
          <div>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D5A27] text-white rounded cursor-pointer">
              <UploadCloud /> Upload
              <input type="file" multiple onChange={(e) => handleFiles(e.target.files)} className="hidden" />
            </label>
          </div>
          <button onClick={handleBulkDelete} className="px-3 py-2 rounded border flex items-center gap-2"><Trash /> Delete</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-40 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {filtered.map((it) => (
              <motion.div key={it.id} whileHover={{ scale: 1.02 }} className="relative bg-white rounded overflow-hidden shadow-sm">
                <button onClick={() => setSelected((s) => ({ ...s, [it.id]: !s[it.id] }))} className="absolute left-2 top-2 z-10 bg-white rounded-full p-1">
                  {selected[it.id] ? <CheckCircle color="#2D5A27" /> : <input type="checkbox" checked={!!selected[it.id]} readOnly />}
                </button>

                <div className="cursor-pointer" onClick={() => setDrawerItem(it)}>
                  <div className="relative h-56 w-full bg-gray-50">
                    {/* Use next/image for optimized delivery and automatic webp when possible */}
                    <Image src={it.url} alt={it.alt_text || it.name || "media"} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />
                    {!it.alt_text && (
                      <div className="absolute left-2 bottom-2 bg-yellow-100 text-yellow-800 rounded px-2 py-1 text-xs flex items-center gap-1">
                        <ImgIcon size={14} /> Missing alt
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-medium truncate">{it.title || it.name}</div>
                    <div className="text-xs text-gray-500">{it.file_type} • {Math.round((it.file_size || 0) / 1024)} KB</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {drawerItem && (
          <motion.aside initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} className="fixed right-0 top-0 h-full w-96 bg-white border-l p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">{drawerItem.title || drawerItem.name}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => setDrawerItem(null)} className="px-3 py-1 rounded border">Close</button>
                <button onClick={async () => { await fetch(`/api/media/${drawerItem.id}`, { method: "DELETE" }); setItems((s) => s.filter((x) => x.id !== drawerItem.id)); setDrawerItem(null); }} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
              </div>
            </div>

            <div className="relative h-56 w-full mb-4">
              <Image src={drawerItem.url} alt={drawerItem.alt_text || drawerItem.name || "media"} fill style={{ objectFit: "contain" }} />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500">Alt text</label>
                <input defaultValue={drawerItem.alt_text ?? ""} onBlur={async (e) => {
                  const val = e.currentTarget.value;
                  await fetch(`/api/media/metadata/${drawerItem.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ alt_text: val }) });
                  setItems((s) => s.map((it) => it.id === drawerItem.id ? { ...it, alt_text: val } : it));
                }} className="w-full px-3 py-2 border rounded" />
              </div>

              <div>
                <label className="block text-xs text-gray-500">Caption</label>
                <textarea defaultValue={drawerItem.caption ?? ""} onBlur={async (e) => {
                  const val = e.currentTarget.value;
                  await fetch(`/api/media/metadata/${drawerItem.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ caption: val }) });
                  setItems((s) => s.map((it) => it.id === drawerItem.id ? { ...it, caption: val } : it));
                }} className="w-full px-3 py-2 border rounded h-24" />
              </div>

              <div className="text-sm text-gray-500">URL: <code className="break-all">{drawerItem.url}</code></div>
              <div className="text-sm text-gray-500">Uploaded: {new Date(drawerItem.created_at || "").toLocaleString()}</div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
