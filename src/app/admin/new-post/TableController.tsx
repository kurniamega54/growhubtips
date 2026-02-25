"use client";

import { useEffect, useState } from "react";
import { type Editor } from "@tiptap/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
} from "lucide-react";

const CELL_COLORS = [
  { name: "None", value: null },
  { name: "Terracotta", value: "#D96C32" },
  { name: "Sage", value: "#8E9775" },
  { name: "Forest", value: "#2D5A27" },
  { name: "Light Sage", value: "#f3f8f4" },
];

export function TableController({ editor }: { editor: Editor | null }) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null
  );
  const [showController, setShowController] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (!editor) return null;

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      const { $from } = editor.state.selection;
      const node = $from.node($from.depth);

      if (node?.type.name === "tableCell" || node?.type.name === "tableHeader") {
        const coords = editor.view.coordsAtPos($from.pos);
        setPosition({ top: coords.top, left: coords.left });
        setShowController(true);
      } else {
        setShowController(false);
      }
    };

    editor.on("selectionUpdate", handleSelectionUpdate);
    editor.on("update", handleSelectionUpdate);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
      editor.off("update", handleSelectionUpdate);
    };
  }, [editor]);

  if (!editor || !showController || !position) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          position: "fixed",
          top: `${position.top - 70}px`,
          left: `${position.left}px`,
          zIndex: 1000,
        }}
        className="rounded-lg border border-primary-200 bg-white shadow-lg p-2 flex gap-1 flex-wrap max-w-xs"
      >
        {/* Add Row Below */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            editor.chain().focus().addRowAfter().run();
            setShowController(false);
          }}
          className="flex items-center justify-center h-8 w-8 rounded bg-primary-100 text-primary-600 hover:bg-primary-200"
          title="Add row below"
        >
          <Plus size={16} />
        </motion.button>

        {/* Delete Row */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            editor.chain().focus().deleteRow().run();
            setShowController(false);
          }}
          className="flex items-center justify-center h-8 w-8 rounded bg-red-100 text-red-600 hover:bg-red-200"
          title="Delete row"
        >
          <Trash2 size={16} />
        </motion.button>

        {/* Add Column */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            editor.chain().focus().addColumnAfter().run();
            setShowController(false);
          }}
          className="flex items-center justify-center h-8 w-8 rounded bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
          title="Add column"
        >
          <Copy size={16} />
        </motion.button>

        {/* Delete Column */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            editor.chain().focus().deleteColumn().run();
            setShowController(false);
          }}
          className="flex items-center justify-center h-8 w-8 rounded bg-red-100 text-red-600 hover:bg-red-200"
          title="Delete column"
        >
          <Trash2 size={16} />
        </motion.button>

        {/* Align Left */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => editor.chain().focus().setCellAttribute("textAlign", "left").run()}
          className="flex items-center justify-center h-8 w-8 rounded bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          title="Align left"
        >
          <AlignLeft size={16} />
        </motion.button>

        {/* Align Center */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => editor.chain().focus().setCellAttribute("textAlign", "center").run()}
          className="flex items-center justify-center h-8 w-8 rounded bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          title="Align center"
        >
          <AlignCenter size={16} />
        </motion.button>

        {/* Align Right */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => editor.chain().focus().setCellAttribute("textAlign", "right").run()}
          className="flex items-center justify-center h-8 w-8 rounded bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          title="Align right"
        >
          <AlignRight size={16} />
        </motion.button>

        {/* Color Picker Button */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center justify-center h-8 w-8 rounded bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
            title="Cell background color"
          >
            <Palette size={16} />
          </motion.button>

          {/* Color Options */}
          {showColorPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-10 left-0 bg-white border border-gray-200 rounded-lg p-2 shadow-lg z-50 grid grid-cols-2 gap-1"
            >
              {CELL_COLORS.map((color) => (
                <motion.button
                  key={color.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .setCellAttribute(
                        "backgroundColor",
                        color.value
                      )
                      .run();
                    setShowColorPicker(false);
                  }}
                  className="flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-100"
                  title={color.name}
                >
                  {color.value ? (
                    <div
                      className="h-6 w-full rounded border border-gray-300"
                      style={{ backgroundColor: color.value }}
                    />
                  ) : (
                    <div className="h-6 w-full rounded border-2 border-dashed border-gray-300" />
                  )}
                  <span className="text-xs text-gray-600">{color.name}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
