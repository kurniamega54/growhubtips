/*
 * TipTap Slash Suggestion - integrates with tippy.js and a React menu
 * Exports a factory function that returns the Suggestion() extension
 * and helpers (block definitions + filter).
 */

import Suggestion from "@tiptap/suggestion";
import tippy from "tippy.js";
import { createRoot } from "react-dom/client";
import React from "react";
import SlashMenu from "@/app/admin/_components/Editor/SlashMenu";

export interface BlockSuggestion {
  type: string;
  label: string;
  description: string;
  icon: string;
}

export const BLOCK_SUGGESTIONS: BlockSuggestion[] = [
  { type: "heading1", label: "Heading 1", description: "Large section heading", icon: "🌱" },
  { type: "heading2", label: "Heading 2", description: "Medium section heading", icon: "🌿" },
  { type: "heading3", label: "Heading 3", description: "Small section heading", icon: "🪴" },
  { type: "bulletList", label: "Bullet List", description: "Simple list with bullets", icon: "📋" },
  { type: "orderedList", label: "Numbered List", description: "Ordered numbered list", icon: "📌" },
  { type: "quote", label: "Quote", description: "Highlight an important quote", icon: "💬" },
  { type: "image", label: "Image", description: "Add an image", icon: "🌸" },
  { type: "embed", label: "Embed", description: "YouTube / Instagram / X URL", icon: "🎥" },
  { type: "table", label: "Table", description: "Insert a table", icon: "📊" },
  { type: "plantCareCard", label: "Plant Care Card", description: "Plant care instructions block", icon: "🌾" },
  { type: "proTip", label: "Pro Tip", description: "Expert tip or callout", icon: "💡" },
  { type: "growthTimeline", label: "Growth Timeline", description: "Plant growth timeline", icon: "🌳" },
  { type: "smartImage", label: "Smart Image", description: "Insert an optimized image", icon: "🖼️" },
];

export function filterSuggestions(query: string): BlockSuggestion[] {
  if (!query) return BLOCK_SUGGESTIONS;
  const q = query.toLowerCase();
  return BLOCK_SUGGESTIONS.filter((s) => s.label.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.type.toLowerCase().includes(q));
}

function executeBlock(editor: any, range: { from: number; to: number }, item: BlockSuggestion) {
  // Remove the trigger text
  editor.chain().focus().deleteRange(range).run();

  switch (item.type) {
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
      // insert an empty smartImage node; UI should prompt for URL elsewhere
      editor.chain().focus().insertContent({ type: "smartImage", attrs: { src: "" } }).run();
      break;
    case "embed":
      editor.chain().focus().insertContent({ type: "embedBlock", attrs: { platform: "youtube", url: "" } }).run();
      break;
    case "table":
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
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
    case "smartImage":
      editor.chain().focus().insertContent({ type: "smartImage", attrs: { src: "" } }).run();
      break;
    default:
      break;
  }
}

import type { Extension } from "@tiptap/core";

export default function SlashSuggestion(): Extension {
  // Suggestion() returns a plugin, cast to Extension for the editor
  // cast options because the generic type from @tiptap/suggestion
  // is quite strict and we only care that it returns an Extension.
  // build options object separately and cast to any before passing to Suggestion
  const options: any = {
    char: "/",
    startOfLine: true,
    command: ({ editor, range, props }: any) => executeBlock(editor, range, props),
    items: ({ query }: any) => filterSuggestions(query),
    render: () => {
      let componentRoot: any = null;
      let popup: any = null;

      return {
        onStart: (props: any) => {
          const el = document.createElement("div");
          popup = tippy("body", {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: el,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
          });

          const root = createRoot(el);
          componentRoot = root;

          root.render(
            React.createElement(SlashMenu, {
              items: props.items,
              command: (item: BlockSuggestion) => props.command(item),
              clientRect: props.clientRect,
              onClose: () => props.client?.blur?.(),
            })
          );
        },
        onUpdate: (props: any) => {
          if (popup && popup[0]) {
            popup[0].setProps({ getReferenceClientRect: props.clientRect });
            if (componentRoot) {
              componentRoot.render(
                React.createElement(SlashMenu, {
                  items: props.items,
                  command: (item: BlockSuggestion) => props.command(item),
                  clientRect: props.clientRect,
                  onClose: () => props.client?.blur?.(),
                })
              );
            }
          }
        },
        onKeyDown: (props: any) => {
          // Let the SlashMenu handle navigation via native key events (it listens on window)
          return false;
        },
        onExit: () => {
          try {
            if (componentRoot) {
              componentRoot.unmount();
              componentRoot = null;
            }
          } catch (e) {
            // ignore
          }
          if (popup && popup[0]) {
            popup[0].destroy();
            popup = null;
          }
        },
      } as any;
    },
  };

  return (Suggestion(options) as unknown as Extension);
}
