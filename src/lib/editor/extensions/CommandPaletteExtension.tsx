import { Extension } from "@tiptap/core";

// This extension is not actively used - command palette is implemented
// via the useCommandPalette hook and CommandPaletteManager component
// Kept for future reference if Tiptap Suggestion integration is needed

export const CommandPaletteExtension = Extension.create({
  name: "commandPalette",

  addOptions() {
    return {
      suggestion: {
        char: "/",
      },
    };
  },

  addProseMirrorPlugins() {
    // Command palette functionality is handled by React components
    // instead of Tiptap Suggestion plugin
    return [];
  },
});
