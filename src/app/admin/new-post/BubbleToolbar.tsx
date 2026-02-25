"use client";

import { useCallback, useEffect, useState } from "react";
import { type Editor } from "@tiptap/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bold,
  Italic,
  Strikethrough,
  Link,
  Highlighter,
  Check,
  X,
} from "lucide-react";

function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return /^\//.test(str);
  }
}

export function BubbleToolbar({ editor }: { editor: Editor | null }) {
  const [linkInput, setLinkInput] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  if (!editor) return null;

  const handleBold = useCallback(
    () => editor?.chain().focus().toggleBold().run(),
    [editor]
  );

  const handleItalic = useCallback(
    () => editor?.chain().focus().toggleItalic().run(),
    [editor]
  );

  const handleStrike = useCallback(
    () => editor?.chain().focus().toggleStrike().run(),
    [editor]
  );

  const handleHighlight = useCallback(
    () =>
      editor?.chain().focus().toggleHighlight({ color: "#E0F2E0" }).run(),
    [editor]
  );

  const handleLinkClick = () => {
    setShowLinkInput(!showLinkInput);
    setLinkInput("");
  };

  const handleSetLink = useCallback(() => {
    if (!linkInput.trim()) {
      editor?.chain().focus().unsetLink().run();
      setShowLinkInput(false);
      return;
    }

    if (!isValidUrl(linkInput)) {
      alert("Please enter a valid URL");
      return;
    }

    editor
      ?.chain()
      .focus()
      .setLink({
        href: linkInput,
        target: "_blank",
        rel: "noopener noreferrer nofollow",
      })
      .run();

    setShowLinkInput(false);
    setLinkInput("");
  }, [editor, linkInput]);

  const handleCancelLink = () => {
    setShowLinkInput(false);
    setLinkInput("");
  };

  if (!editor) return null;

  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      const { from, to } = editor.state.selection;
      setShouldShow(from !== to);
    };

    const handleSelectionUpdate = () => {
      const { from, to } = editor.state.selection;
      setShouldShow(from !== to);
    };

    editor.on("update", handleUpdate);
    editor.on("selectionUpdate", handleSelectionUpdate);

    return () => {
      editor.off("update", handleUpdate);
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor]);

  const isBold = editor.isActive("bold");
  const isItalic = editor.isActive("italic");
  const isStrike = editor.isActive("strike");
  const isLink = editor.isActive("link");
  const isHighlight = editor.isActive("highlight");

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed flex items-center gap-1 rounded-lg border border-primary-100 bg-white/80 p-2 backdrop-blur-md shadow-lg z-50"
          style={{
            pointerEvents: "auto",
          }}
        >
        {/* Bold Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBold}
          className={`relative flex h-8 w-8 items-center justify-center rounded transition-colors ${
            isBold
              ? "text-primary-600"
              : "text-primary-400 hover:text-primary-500"
          }`}
          title="Bold"
        >
          <Bold size={18} />
          {isBold && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute bottom-0.5 h-1 w-1 rounded-full bg-primary-600"
            />
          )}
        </motion.button>

        {/* Italic Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleItalic}
          className={`relative flex h-8 w-8 items-center justify-center rounded transition-colors ${
            isItalic
              ? "text-primary-600"
              : "text-primary-400 hover:text-primary-500"
          }`}
          title="Italic"
        >
          <Italic size={18} />
          {isItalic && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute bottom-0.5 h-1 w-1 rounded-full bg-primary-600"
            />
          )}
        </motion.button>

        {/* Strikethrough Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStrike}
          className={`relative flex h-8 w-8 items-center justify-center rounded transition-colors ${
            isStrike
              ? "text-primary-600"
              : "text-primary-400 hover:text-primary-500"
          }`}
          title="Strikethrough"
        >
          <Strikethrough size={18} />
          {isStrike && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute bottom-0.5 h-1 w-1 rounded-full bg-primary-600"
            />
          )}
        </motion.button>

        {/* Highlight Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleHighlight}
          className={`relative flex h-8 w-8 items-center justify-center rounded transition-colors ${
            isHighlight
              ? "text-secondary-600"
              : "text-secondary-400 hover:text-secondary-500"
          }`}
          title="Highlight"
        >
          <Highlighter size={18} />
          {isHighlight && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute bottom-0.5 h-1 w-1 rounded-full bg-secondary-600"
            />
          )}
        </motion.button>

        {/* Divider */}
        <div className="mx-0.5 h-6 w-px bg-primary-200" />

        {/* Link Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLinkClick}
          className={`relative flex h-8 w-8 items-center justify-center rounded transition-colors ${
            isLink || showLinkInput
              ? "text-accent-600"
              : "text-primary-400 hover:text-primary-500"
          }`}
          title="Link"
        >
          <Link size={18} />
          {(isLink || showLinkInput) && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute bottom-0.5 h-1 w-1 rounded-full bg-accent-600"
            />
          )}
        </motion.button>

        {/* Link Input */}
        {showLinkInput && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center gap-1 overflow-hidden"
          >
            <input
              type="url"
              placeholder="https://example.com"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSetLink();
                if (e.key === "Escape") handleCancelLink();
              }}
              autoFocus
              className="flex-1 rounded border border-primary-200 bg-white px-2 py-1 text-sm text-primary-700 placeholder-primary-400 outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSetLink}
              className="flex h-6 w-6 items-center justify-center rounded bg-primary-100 text-primary-600 hover:bg-primary-200"
              title="Apply link"
            >
              <Check size={14} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancelLink}
              className="flex h-6 w-6 items-center justify-center rounded bg-red-100 text-red-600 hover:bg-red-200"
              title="Cancel"
            >
              <X size={14} />
            </motion.button>
          </motion.div>
        )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
