"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Image as ImgIcon, Trash, Check, AlertCircle } from "lucide-react";
import Image from "next/image";

type MediaItem = {
  id: string;
  url: string;
  name?: string;
  title?: string;
  alt_text?: string | null;
  file_type?: string;
};

type MediaPickerProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (item: MediaItem, altText: string) => void;
  requireAltText?: boolean;
};

export default function MediaPicker({
  open,
  onClose,
  onSelect,
  requireAltText = true,
}: MediaPickerProps) {
  const [tab, setTab] = useState<"upload" | "library">("library");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    fetchItems();
  }, [open]);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      const json = await res.json();
      setItems(json.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(files: FileList | null) {
    if (!files) return;
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData();
      fd.append("file", files[i]);
      try {
        const res = await fetch("/api/media", { method: "POST", body: fd });
        const json = await res.json();
        if (json.item) {
          setItems((s) => [json.item, ...s]);
          setUploadProgress(Math.round(((i + 1) / files.length) * 100));
        }
      } catch (e) {
        console.error(e);
      }
    }
    setUploading(false);
    setUploadProgress(0);
    setTab("library");
  }

  const selectedItem = items.find((it) => it.id === selected);
  const missingAlt = requireAltText && !selectedItem?.alt_text && !altText;
  const canInsert = selected && (!requireAltText || selectedItem?.alt_text || altText);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />

          <motion.div
            initial={{ y: 20, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.98 }}
            className="bg-white rounded-lg w-[90vw] max-w-5xl p-6 z-10 max-h-[90vh] overflow-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Media Library</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4 border-b">
              <button
                onClick={() => setTab("upload")}
                className={`px-3 py-2 rounded ${
                  tab === "upload"
                    ? "bg-[#2D5A27] text-white"
                    : "border text-gray-700"
                }`}
              >
                <UploadCloud className="inline mr-2" size={16} /> Upload
              </button>
              <button
                onClick={() => setTab("library")}
                className={`px-3 py-2 rounded ${
                  tab === "library"
                    ? "bg-[#2D5A27] text-white"
                    : "border text-gray-700"
                }`}
              >
                <ImgIcon className="inline mr-2" size={16} /> Library
              </button>
            </div>

            {tab === "upload" ? (
              <div className="space-y-4">
                <div
                  className="border-2 border-dashed rounded-lg p-12 text-center bg-[rgba(241,243,240,1)]"
                  onDrop={(e) => {
                    e.preventDefault();
                    handleUpload(e.dataTransfer.files);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <UploadCloud size={48} className="mx-auto text-[#2D5A27] mb-3" />
                  <p className="text-sm text-gray-600 mb-4">
                    Drag and drop files here or click to select
                  </p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#2D5A27] text-white cursor-pointer hover:bg-[#235721]">
                    <UploadCloud size={16} /> Select files
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleUpload(e.target.files)}
                      className="hidden"
                    />
                  </label>
                </div>
                {uploading && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Uploading... {uploadProgress}%
                    </p>
                    <div className="w-full h-2 bg-gray-100 rounded overflow-hidden">
                      <motion.div
                        className="h-full bg-[#2D5A27]"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {loading ? (
                  <div className="grid grid-cols-4 gap-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-40 bg-gray-100 animate-pulse rounded"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    {items.map((it) => (
                      <motion.div
                        key={it.id}
                        whileHover={{ scale: 1.02 }}
                        className={`border-2 rounded overflow-hidden cursor-pointer transition ${
                          selected === it.id
                            ? "ring-2 ring-[#2D5A27]"
                            : "border-gray-200"
                        }`}
                        onClick={() => {
                          setSelected(it.id);
                          setAltText(it.alt_text || "");
                        }}
                      >
                        <div className="relative h-40 w-full bg-gray-50">
                          <Image
                            src={it.url}
                            alt={it.alt_text || it.name || "media"}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw, 25vw"
                          />
                          {!it.alt_text && (
                            <div className="absolute left-2 bottom-2 bg-yellow-100 text-yellow-800 rounded px-2 py-1 text-xs flex items-center gap-1">
                              <AlertCircle size={12} /> No alt
                            </div>
                          )}
                        </div>
                        <div className="p-2 text-xs truncate">
                          {it.title || it.name}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Alt Text Input (when item selected) */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-6 p-4 bg-gray-50 rounded border border-gray-200"
                >
                  <label className="block text-sm font-medium mb-2">
                    Alt Text {requireAltText && !selectedItem?.alt_text && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    value={altText}
                    onChange={(e) => {
                      setAltText(e.target.value);
                      setWarningMessage("");
                    }}
                    placeholder="Describe the image for accessibility and SEO"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
                  />
                  {missingAlt && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
                      <AlertCircle size={14} /> Alt text is required for SEO and accessibility
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Warning Message */}
            <AnimatePresence>
              {warningMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded flex items-center gap-3"
                >
                  <AlertCircle size={18} className="text-yellow-600 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">{warningMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!selectedItem) return;

                  // Check if alt text is required and missing
                  if (requireAltText && !selectedItem?.alt_text && !altText) {
                    setWarningMessage(
                      "⚠️ Alt text is required for SEO and accessibility. Please add a description before inserting."
                    );
                    return;
                  }

                  // Alt text validation passed, proceed with insertion
                  onSelect(selectedItem, altText || selectedItem.alt_text || "");
                  setWarningMessage("");
                  onClose();
                }}
                disabled={!selected}
                className={`px-4 py-2 rounded text-white flex items-center gap-2 ${
                  selected
                    ? "bg-[#2D5A27] hover:bg-[#235721]"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                <Check size={16} /> Insert Image
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
