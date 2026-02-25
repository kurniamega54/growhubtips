import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { PlantCareCardComponent } from "@/src/app/admin/new-post/PlantCareCardComponent";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    plantCareCard: {
      setPlantCareCard: () => ReturnType;
    };
  }
}

export const PlantCareCard = Node.create({
  name: "plantCareCard",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      lightLevel: {
        default: "medium",
      },
      waterFrequency: {
        default: "Every 3-5 days",
      },
      soilType: {
        default: "Well-draining loam",
      },
      petSafe: {
        default: true,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-plant-care]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ "data-plant-care": "" }, HTMLAttributes),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PlantCareCardComponent);
  },

  addCommands() {
    return {
      setPlantCareCard:
        () =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
          }),
    };
  },
});
