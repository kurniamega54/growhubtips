"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { motion, AnimatePresence } from "framer-motion";
import { SmartImage } from "@/lib/editor/extensions/SmartImage";
import { PlantCareCard } from "@/lib/editor/extensions/PlantCareCard";
import { GrowthTimeline } from "@/lib/editor/extensions/GrowthTimeline";
import { ProTipCallout } from "@/lib/editor/extensions/ProTipCallout";
import { EmbedBlock } from "@/lib/editor/extensions/EmbedBlock";
import SlashSuggestion, { type BlockSuggestion, filterSuggestions } from "@/src/lib/editor/suggestions";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Highlighter,
  LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Image,
  Youtube,
  Table as TableIcon,
  Plus,
  Lightbulb,
  Sprout,
  ListTree,
  Search,
  X,
} from "lucide-react";

export type EditorJson = Record<string, unknown>;

type EditorProps = {
  value?: EditorJson | null;
  onChange: (json: EditorJson) => void;
  placeholder?: string;
  onOpenImagePicker?: (callback: (url: string, alt: string) => void) => void;
};

export function Editor({ value, onChange, placeholder, onOpenImagePicker }: EditorProps) {
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [blockSearchQuery, setBlockSearchQuery] = useState("");

  const filteredSuggestions = filterSuggestions(blockSearchQuery);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      Underline,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({ placeholder: placeholder || "Start writing your article..." }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      SmartImage,
      EmbedBlock,
      PlantCareCard,
      ProTipCallout,
      GrowthTimeline,
      SlashSuggestion(),
    ],

    content: value ?? undefined,
    autofocus: true,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getJSON() as EditorJson);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg prose-primary max-w-none focus:outline-none font-sans leading-relaxed min-h-[400px] px-4 py-2",
      },
    },
  });

  useEffect(() => {
    if (!editor || !value) return;
    const current = editor.getJSON();
    if (JSON.stringify(current) !== JSON.stringify(value)) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) return null;

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", previous || "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  /**
   * Execute block command based on suggestion type
   */
  const executeBlockCommand = (suggestion: BlockSuggestion) => {
    // Delete the "/" and query text
    // remove any leading slash trigger if present
    const { $from } = editor.state.selection;
    const { textContent } = $from.node();
    const match = textContent.match(/^\/(.*)/);
    if (match) {
      const textToDelete = "/" + (match[1] || "");
      editor.chain().deleteRange({ from: $from.start(), to: $from.start() + textToDelete.length }).focus().run();
    }

    // Execute the command
    switch (suggestion.type) {
      case "heading1":
        editor.chain().focus().setHeading({ level: 1 }).run();
        break;
      case "heading2":
        editor.chain().focus().setHeading({ level: 2 }).run();
        break;
      case "heading3":
        editor.chain().focus().setHeading({ level: 3 }).run();
        break;
      case "bulletList":
        editor.chain().focus().toggleBulletList().run();
        break;
      case "orderedList":
        editor.chain().focus().toggleOrderedList().run();
        break;
      case "quote":
        editor.chain().focus().toggleBlockquote().run();
        break;
      case "image":
        if (onOpenImagePicker) {
          onOpenImagePicker((url: string, alt: string) => {
            editor.chain().focus().insertContent({
              type: "smartImage",
              attrs: { src: url, alt: alt || "" },
            }).run();
          });
        } else {
          const url = window.prompt("Enter image URL");
          if (url) {
            editor.chain().focus().insertContent({
              type: "smartImage",
              attrs: { src: url },
            }).run();
          }
        }
        break;
      case "embed":
        const embedUrl = window.prompt("Enter YouTube, Instagram, or X URL");
        if (embedUrl) {
          let platform = "youtube";
          if (/instagram\.com/.test(embedUrl)) platform = "instagram";
          if (/twitter\.com|x\.com/.test(embedUrl)) platform = "x";
          editor.chain().focus().insertContent({
            type: "embedBlock",
            attrs: { platform, url: embedUrl },
          }).run();
        }
        break;
      case "table":
        editor.chain().focus().insertTable({
          rows: 3,
          cols: 3,
          withHeaderRow: true,
        }).run();
        break;
      case "plantCareCard":
        editor.chain().focus().insertContent({ type: "plantCareCard" }).run();
        break;
      case "proTip":
        editor.chain().focus().insertContent({ type: "proTipCallout" }).run();
        break;
      case "growthTimeline":
        editor.chain().focus().insertContent({ type: "growthTimeline" }).run();
        break;
    }

    setShowBlockMenu(false);
  };

  // Register slash suggestion extension (renders separate tippy menu)
  // Ensure extension is added only when editor exists
  useEffect(() => {
    if (!editor) return;
    // add suggestion extension dynamically if not present
    // Note: extensions are set on init; we included SlashSuggestion in the editor config directly
  }, [editor]);

  return (
    <div className="rounded-3xl border border-primary-200 bg-white shadow-organic">
      {/* Formatting Toolbar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-primary-100 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition ${
            editor.isActive("bold")
              ? "bg-primary-100 text-primary-700"
              : "text-neutral-500 hover:bg-neutral-100"
          }`}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg transition ${
            editor.isActive("italic")
              ? "bg-primary-100 text-primary-700"
              : "text-neutral-500 hover:bg-neutral-100"
          }`}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded-lg transition ${
            editor.isActive("underline")
              ? "bg-primary-100 text-primary-700"
              : "text-neutral-500 hover:bg-neutral-100"
          }`}
          title="Underline"
        >
          <UnderlineIcon size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded-lg transition ${
            editor.isActive("highlight")
              ? "bg-primary-100 text-primary-700"
              : "text-neutral-500 hover:bg-neutral-100"
          }`}
          title="Highlight"
        >
          <Highlighter size={18} />
        </button>
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded-lg transition ${
            editor.isActive("link")
              ? "bg-primary-100 text-primary-700"
              : "text-neutral-500 hover:bg-neutral-100"
          }`}
          title="Link"
        >
          <LinkIcon size={18} />
        </button>

        <div className="w-px h-6 bg-neutral-200 mx-1" />

        {/* Block Insert Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowBlockMenu(!showBlockMenu)}
            className={`p-2 rounded-lg transition flex items-center gap-1 ${
              showBlockMenu
                ? "bg-primary-100 text-primary-700"
                : "text-neutral-500 hover:bg-neutral-100"
            }`}
            title="Insert block (or type '/' in editor)"
          >
            <Plus size={18} />
            <span className="text-sm font-medium">Block</span>
          </button>

          <AnimatePresence>
            {showBlockMenu && (
              <>
                <motion.div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowBlockMenu(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <motion.div
                  className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl border border-primary-200 shadow-organic overflow-hidden z-20"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <div className="px-3 py-2 flex items-center gap-2 border-b border-primary-100 bg-primary-50">
                    <Search size={16} className="text-primary-600" />
                    <input
                      type="text"
                      placeholder="Search blocks..."
                      value={blockSearchQuery}
                      onChange={(e) => setBlockSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-neutral-700 placeholder-neutral-400"
                      autoFocus
                    />
                    {blockSearchQuery && (
                      <button
                        onClick={() => setBlockSearchQuery("")}
                        className="p-1 hover:bg-primary-100 rounded transition"
                      >
                        <X size={14} className="text-neutral-500" />
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-auto">
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.type}
                          type="button"
                          onClick={() => executeBlockCommand(suggestion)}
                          className="w-full flex items-start gap-3 px-4 py-3 hover:bg-primary-50 transition text-left border-b border-primary-50 last:border-b-0"
                        >
                          <div className="text-2xl mt-0.5">{suggestion.icon}</div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-neutral-800">
                              {suggestion.label}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {suggestion.description}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-sm text-neutral-400">
                        No blocks found
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} />
        
        {/* Slash suggestion handled by SlashSuggestion extension (tippy + React menu) */}
      </div>
    </div>
  );
}
