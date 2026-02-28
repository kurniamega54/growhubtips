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
import Suggestion from "@tiptap/suggestion";
import { motion, AnimatePresence } from "framer-motion";
import { SmartImage } from "@/lib/editor/extensions/SmartImage";
import { PlantCareCard } from "@/lib/editor/extensions/PlantCareCard";
import { GrowthTimeline } from "@/lib/editor/extensions/GrowthTimeline";
import { ProTipCallout } from "@/lib/editor/extensions/ProTipCallout";
import { EmbedBlock } from "@/lib/editor/extensions/EmbedBlock";
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
} from "lucide-react";

export type EditorJson = Record<string, unknown>;

type EditorProps = {
  value?: EditorJson | null;
  onChange: (json: EditorJson) => void;
  placeholder?: string;
};

export function Editor({ value, onChange, placeholder }: EditorProps) {
  const [showBlockMenu, setShowBlockMenu] = useState(false);

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

  const blockOptions = [
    {
      title: "Heading 1",
      icon: <Heading1 size={16} />,
      command: () => {
        editor.chain().focus().setHeading({ level: 1 }).run();
        setShowBlockMenu(false);
      },
    },
    {
      title: "Heading 2",
      icon: <Heading2 size={16} />,
      command: () => {
        editor.chain().focus().setHeading({ level: 2 }).run();
        setShowBlockMenu(false);
      },
    },
    {
      title: "Heading 3",
      icon: <Heading3 size={16} />,
      command: () => {
        editor.chain().focus().setHeading({ level: 3 }).run();
        setShowBlockMenu(false);
      },
    },
    {
      title: "Bullet List",
      icon: <List size={16} />,
      command: () => {
        editor.chain().focus().toggleBulletList().run();
        setShowBlockMenu(false);
      },
    },
    {
      title: "Numbered List",
      icon: <ListOrdered size={16} />,
      command: () => {
        editor.chain().focus().toggleOrderedList().run();
        setShowBlockMenu(false);
      },
    },
    {
      title: "Quote",
      icon: <Quote size={16} />,
      command: () => {
        editor.chain().focus().toggleBlockquote().run();
        setShowBlockMenu(false);
      },
    },
    {
      title: "Image",
      icon: <Image size={16} />,
      command: () => {
        const url = window.prompt("Enter image URL");
        if (url) {
          editor.chain().focus().insertContent({ type: "smartImage", attrs: { src: url } }).run();
        }
        setShowBlockMenu(false);
      },
    },
    {
      title: "Embed (YouTube/Instagram/X)",
      icon: <Youtube size={16} />,
      command: () => {
        const url = window.prompt("Enter YouTube, Instagram, or X URL");
        if (url) {
          let platform = "youtube";
          if (/instagram\.com/.test(url)) platform = "instagram";
          if (/twitter\.com|x\.com/.test(url)) platform = "x";
          editor.chain().focus().insertContent({ type: "embedBlock", attrs: { platform, url } }).run();
        }
        setShowBlockMenu(false);
      },
    },
    {
      title: "Table",
      icon: <TableIcon size={16} />,
      command: () => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        setShowBlockMenu(false);
      },
    },
    {
      title: "Plant Care Card",
      icon: <Sprout size={16} />,
      command: () => {
        editor.chain().focus().insertContent({ type: "plantCareCard" }).run();
        setShowBlockMenu(false);
      },
    },
    {
      title: "Pro Tip",
      icon: <Lightbulb size={16} />,
      command: () => {
        editor.chain().focus().insertContent({ type: "proTipCallout" }).run();
        setShowBlockMenu(false);
      },
    },
    {
      title: "Growth Timeline",
      icon: <ListTree size={16} />,
      command: () => {
        editor.chain().focus().insertContent({ type: "growthTimeline" }).run();
        setShowBlockMenu(false);
      },
    },
  ];

  return (
    <div className="rounded-3xl border border-primary-200 bg-white shadow-organic">
      {/* Formatting Toolbar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-primary-100 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition ${
            editor.isActive("bold") ? "bg-primary-100 text-primary-700" : "text-neutral-500 hover:bg-neutral-100"
          }`}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg transition ${
            editor.isActive("italic") ? "bg-primary-100 text-primary-700" : "text-neutral-500 hover:bg-neutral-100"
          }`}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded-lg transition ${
            editor.isActive("underline") ? "bg-primary-100 text-primary-700" : "text-neutral-500 hover:bg-neutral-100"
          }`}
          title="Underline"
        >
          <UnderlineIcon size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded-lg transition ${
            editor.isActive("highlight") ? "bg-primary-100 text-primary-700" : "text-neutral-500 hover:bg-neutral-100"
          }`}
          title="Highlight"
        >
          <Highlighter size={18} />
        </button>
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded-lg transition ${
            editor.isActive("link") ? "bg-primary-100 text-primary-700" : "text-neutral-500 hover:bg-neutral-100"
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
              showBlockMenu ? "bg-primary-100 text-primary-700" : "text-neutral-500 hover:bg-neutral-100"
            }`}
            title="Insert block"
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
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl border border-primary-200 shadow-organic overflow-hidden z-20"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <div className="px-3 py-2 text-xs font-semibold text-primary-600 bg-primary-50">
                    Insert Block
                  </div>
                  <div className="max-h-96 overflow-auto">
                    {blockOptions.map((option, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={option.command}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-primary-50 transition text-left"
                      >
                        <div className="text-primary-600">{option.icon}</div>
                        <span className="text-sm font-medium text-neutral-700">{option.title}</span>
                      </button>
                    ))}
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
      </div>
    </div>
  );
}
