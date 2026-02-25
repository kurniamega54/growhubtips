"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X, Edit2 } from "lucide-react";

export function MediaCard({
  src,
  alt,
  title,
  caption,
  onUpdate,
  onDelete,
}: {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
  onUpdate: (data: { alt: string; title?: string; caption?: string }) => void;
  onDelete: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editAlt, setEditAlt] = useState(alt);
  const [editTitle, setEditTitle] = useState(title || "");
  const [editCaption, setEditCaption] = useState(caption || "");
  const [isLoading, setIsLoading] = useState(true);

  const handleSave = () => {
    onUpdate({
      alt: editAlt,
      title: editTitle || undefined,
      caption: editCaption || undefined,
    });
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="my-6 group"
    >
      <div className="relative rounded-2xl overflow-hidden shadow-organic bg-white">
        {/* Image Container */}
        <div className="relative w-full bg-primary-50">
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary-100 via-primary-50 to-primary-100 animate-pulse" />
          )}
          <img
            src={src}
            alt={alt}
            onLoad={() => setIsLoading(false)}
            className="w-full h-auto"
          />
        </div>

        {/* Edit Overlay */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(!isEditing)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white hover:bg-primary-700"
            title="Edit image details"
          >
            <Edit2 size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
            title="Delete image"
          >
            <X size={16} />
          </motion.button>
        </div>
      </div>

      {/* Edit Panel */}
      {isEditing && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-3 rounded-lg border border-primary-200 bg-primary-50 p-4 space-y-3"
        >
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">
              Alt Text (Critical for SEO)
            </label>
            <input
              type="text"
              value={editAlt}
              onChange={(e) => setEditAlt(e.target.value)}
              placeholder="e.g., 'Tomato plant with ripe red fruits'"
              className="w-full rounded border border-primary-300 bg-white px-3 py-2 text-sm text-primary-700 placeholder-primary-400 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
            <p className="mt-1 text-xs text-primary-600">
              Used by search engines and screen readers
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">
              Image Title (Optional SEO)
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="e.g., 'Tomato Plant Growth Stage'"
              className="w-full rounded border border-primary-300 bg-white px-3 py-2 text-sm text-primary-700 placeholder-primary-400 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">
              Caption (Shown Below Image)
            </label>
            <textarea
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              placeholder="e.g., 'A healthy tomato plant ready for harvest'"
              rows={2}
              className="w-full rounded border border-primary-300 bg-white px-3 py-2 text-sm text-primary-700 placeholder-primary-400 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex-1 rounded bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Save Details
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEditing(false)}
              className="flex-1 rounded border border-primary-300 bg-white px-3 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Caption Display */}
      {caption && !isEditing && (
        <p className="mt-3 text-sm italic text-secondary-600">{caption}</p>
      )}
    </motion.div>
  );
}
