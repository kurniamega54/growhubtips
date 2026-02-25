"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/extension-bubble-menu";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { SmartImage } from "@/src/lib/editor/extensions/SmartImage";
import { EmbedBlock } from "@/src/lib/editor/extensions/EmbedBlock";
import { PlantCareCard } from "@/src/lib/editor/extensions/PlantCareCard";
import { ProTipCallout } from "@/src/lib/editor/extensions/ProTipCallout";
import { GrowthTimeline } from "@/src/lib/editor/extensions/GrowthTimeline";
import { autoSavePostAction } from "@/src/app/admin/actions";
import { StatusManager, type SaveStatus } from "@/src/app/admin/new-post/StatusManager";
import { BubbleToolbar } from "@/src/app/admin/new-post/BubbleToolbar";
import { TableController } from "@/src/app/admin/new-post/TableController";
import { CommandPaletteManager } from "@/src/app/admin/new-post/CommandPaletteManager";
import type { EditorJson } from "@/src/types/editor";

const AUTOSAVE_DELAY_MS = 20000;

function useDebouncedCallback(callback: () => void, delayMs: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const schedule = () => {
    cancel();
    timeoutRef.current = setTimeout(callback, delayMs);
  };

  return { schedule, cancel };
}

export function Editor({ postId }: { postId?: string }) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const lastSavedJsonRef = useRef<string | null>(null);
  const latestJsonRef = useRef<EditorJson | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapBubbleMenu,
      SmartImage,
      EmbedBlock,
      PlantCareCard,
      ProTipCallout,
      GrowthTimeline,
      Table.configure({
        resizable: true,
        handleWidth: 4,
        cellMinWidth: 50,
        lastColumnResizable: true,
        allowTableNodeSelection: false,
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "bg-accent-500 text-white font-semibold",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-300 p-4",
        },
      }).extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            backgroundColor: {
              default: null,
              parseHTML: (element) =>
                element.style.backgroundColor || null,
              renderHTML: (attributes) => {
                if (!attributes.backgroundColor) return {};
                return {
                  style: `background-color: ${attributes.backgroundColor}`,
                };
              },
            },
            textAlign: {
              default: "left",
              parseHTML: (element) =>
                element.style.textAlign || "left",
              renderHTML: (attributes) => {
                return {
                  style: `text-align: ${attributes.textAlign}`,
                };
              },
            },
          };
        },
      }),
      Placeholder.configure({
        placeholder: "Type '/' for commands...",
      }),
    ],
    content: "",
    editorProps: {
      handleDOMEvents: {
        drop: (view, event: DragEvent) => {
          const files = event.dataTransfer?.files;
          if (!files) return false;

          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith("image/")) continue;

            const reader = new FileReader();
            reader.onload = (e) => {
              const src = e.target?.result as string;
              editor?.commands.setSmartImage({ src, alt: file.name });
            };
            reader.readAsDataURL(file);
          }

          return true;
        },
        paste: (view, event: ClipboardEvent) => {
          const items = event.clipboardData?.items;
          if (!items) return false;

          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (!item.type.startsWith("image/")) continue;

            const file = item.getAsFile();
            if (!file) continue;

            const reader = new FileReader();
            reader.onload = (e) => {
              const src = e.target?.result as string;
              editor?.commands.setSmartImage({ src, alt: "Pasted image" });
            };
            reader.readAsDataURL(file);

            return true;
          }

          return false;
        },
      },
    },
  });

  const debouncedSave = useDebouncedCallback(async () => {
    if (!postId || !latestJsonRef.current) return;

    try {
      setStatus("syncing");
      const result = await autoSavePostAction({
        postId,
        contentJson: latestJsonRef.current,
      });
      setLastSaved(result?.lastSaved ?? new Date().toISOString());
      setStatus("saved");
      localStorage.removeItem(`editor-draft-${postId}`);
    } catch {
      setStatus("offline");
      try {
        localStorage.setItem(
          `editor-draft-${postId}`,
          JSON.stringify({
            contentJson: latestJsonRef.current,
            savedAt: new Date().toISOString(),
          })
        );
      } catch {
        // Ignore storage failures
      }
    }
  }, AUTOSAVE_DELAY_MS);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      const json = editor.getJSON() as EditorJson;
      const serialized = JSON.stringify(json);

      if (serialized === lastSavedJsonRef.current) return;

      latestJsonRef.current = json;
      lastSavedJsonRef.current = serialized;
      debouncedSave.schedule();
    };

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
      debouncedSave.cancel();
    };
  }, [editor, debouncedSave]);

  const lastSavedLabel = useMemo(() => {
    if (!lastSaved) return null;
    const date = new Date(lastSaved);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleTimeString();
  }, [lastSaved]);

  return (
    <div className="bg-white max-w-4xl mx-auto p-12 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-secondary-500">
          {lastSavedLabel ? `Last saved at ${lastSavedLabel}` : "Not saved yet"}
        </div>
        <StatusManager status={status} />
      </div>
      <BubbleToolbar editor={editor} />
      <TableController editor={editor} />
      <CommandPaletteManager editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
