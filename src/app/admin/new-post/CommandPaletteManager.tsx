"use client";

import type { Editor } from "@tiptap/core";
import { CommandPalette } from "@/src/app/admin/new-post/CommandPalette";
import { COMMAND_ITEMS } from "@/src/lib/editor/commands/commands";
import { fuzzySearch } from "@/src/lib/utils/fuzzySearch";
import { useCommandPalette } from "@/src/hooks/useCommandPalette";

interface CommandPaletteManagerProps {
  editor: Editor | null;
}

export function CommandPaletteManager({
  editor,
}: CommandPaletteManagerProps) {
  const { state, handleSelectCommand } = useCommandPalette({ editor });

  const results = fuzzySearch(
    state.query,
    COMMAND_ITEMS.map((item) => ({
      id: item.id,
      label: item.label,
      searchText: item.searchText,
    }))
  );

  return (
    <CommandPalette
      items={COMMAND_ITEMS}
      selectedIndex={state.selectedIndex}
      onSelect={handleSelectCommand}
      query={state.query}
      position={state.isOpen && results.length > 0 ? state.position : null}
    />
  );
}
