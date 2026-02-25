"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor } from "@tiptap/react";
import { type Editor } from "@tiptap/core";
import { CommandPalette } from "@/src/app/admin/new-post/CommandPalette";
import { COMMAND_ITEMS } from "@/src/lib/editor/commands/commands";
import { fuzzySearch } from "@/src/lib/utils/fuzzySearch";

interface UseCommandPaletteProps {
  editor: Editor | null;
}

export interface CommandPaletteState {
  isOpen: boolean;
  query: string;
  selectedIndex: number;
  position: { top: number; left: number } | null;
}

/**
 * Hook to manage command palette state and logic
 */
export function useCommandPalette({ editor }: UseCommandPaletteProps) {
  const [state, setState] = useState<CommandPaletteState>({
    isOpen: false,
    query: "",
    selectedIndex: 0,
    position: null,
  });

  const commandRef = useRef<any>(null);

  // Listen for slash command trigger
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      const { selection, doc } = editor.state;
      const { from } = selection;
      const $from = doc.resolve(from);

      // Check if we're at the start of a paragraph
      const isStartOfBlock =
        $from.parent.type.name === "paragraph" &&
        $from.parentOffset === 0;

      if (!isStartOfBlock) {
        setState((prev) => ({ ...prev, isOpen: false }));
        return;
      }

      // Check for "/" character
      const nodeText = $from.parent.textContent;
      if (nodeText.startsWith("/")) {
        // Extract query after "/"
        const query = nodeText.substring(1);
        const coords = editor.view.coordsAtPos(from);

        setState((prev) => ({
          ...prev,
          isOpen: true,
          query,
          position: { top: coords.top + 24, left: coords.left },
          selectedIndex: 0,
        }));
      } else {
        setState((prev) => ({ ...prev, isOpen: false }));
      }
    };

    editor.on("update", handleUpdate);
    editor.on("selectionUpdate", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!state.isOpen) return;

      const results = fuzzySearch(
        state.query,
        COMMAND_ITEMS.map((item) => ({
          id: item.id,
          label: item.label,
          searchText: item.searchText,
        }))
      );

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setState((prev) => ({
          ...prev,
          selectedIndex: (prev.selectedIndex + 1) % results.length,
        }));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setState((prev) => ({
          ...prev,
          selectedIndex:
            (prev.selectedIndex - 1 + results.length) % results.length,
        }));
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (results.length > 0) {
          const selectedItem = results[state.selectedIndex].item;
          const commandItem = COMMAND_ITEMS.find(
            (item) => item.id === selectedItem.id
          );
          if (commandItem) {
            handleSelectCommand(commandItem);
          }
        }
      } else if (event.key === "Escape") {
        event.preventDefault();
        setState((prev) => ({ ...prev, isOpen: false }));
      }
    },
    [state]
  );

  // Attach keyboard listener
  useEffect(() => {
    if (state.isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [state, handleKeyDown]);

  // Handle command selection
  const handleSelectCommand = useCallback(
    (item: (typeof COMMAND_ITEMS)[0]) => {
      if (!editor) return;

      const { selection } = editor.state;
      const { from, to } = selection;

      // Find range from start of line to current position
      const $from = editor.state.doc.resolve(from);
      const start = $from.start();
      const range = { from: start, to };

      // Execute command
      item.command({ editor, range });

      // Close palette
      setState((prev) => ({ ...prev, isOpen: false, query: "" }));
    },
    [editor]
  );

  return {
    state,
    handleSelectCommand,
  };
}


