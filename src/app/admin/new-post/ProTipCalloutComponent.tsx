"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export function ProTipCalloutComponent(props: any) {
  const { node, updateAttributes } = props;
  const { content } = (node.attrs || {}) as { content: string };
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(content || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    updateAttributes({ content: editText });
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.3 }}
      className="my-6 rounded-lg border-l-4 border-primary-600 bg-secondary-50 p-5 shadow-md"
      onClick={() => !isEditing && setIsEditing(true)}
      role="button"
      tabIndex={0}
    >
      <div className="flex gap-4">
        {/* Pulsing Leaf Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex-shrink-0 text-2xl"
        >
          🍃
        </motion.div>

        {/* Content */}
        <div className="flex-1">
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <textarea
                ref={textareaRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Enter your pro tip here..."
                rows={3}
                className="w-full rounded border border-primary-300 bg-white px-3 py-2 text-sm text-primary-700 placeholder-primary-400 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="flex-1 rounded bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Save Tip
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setEditText(content || "");
                    setIsEditing(false);
                  }}
                  className="flex-1 rounded border border-primary-300 bg-white px-3 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div className="space-y-1">
              <p className="text-xs font-semibold text-primary-600 uppercase">
                Pro Tip
              </p>
              <p className="text-sm leading-relaxed text-primary-700">
                {content ||
                  "Click to add a professional gardening tip..."}
              </p>
              <p className="text-xs text-primary-500 italic pt-1">
                Click to edit
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
