import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { GrowthTimelineComponent } from "@/src/app/admin/new-post/GrowthTimelineComponent";

interface TimelineStep {
  title: string;
  description: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    growthTimeline: {
      setGrowthTimeline: () => ReturnType;
    };
  }
}

export const GrowthTimeline = Node.create({
  name: "growthTimeline",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      steps: {
        default: [
          { title: "Step 1", description: "Plant your seed or seedling" },
          {
            title: "Step 2",
            description: "Water regularly and provide sunlight",
          },
          { title: "Step 3", description: "Monitor growth and adjust care" },
        ],
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-growth-timeline]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ "data-growth-timeline": "" }, HTMLAttributes),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(GrowthTimelineComponent);
  },

  addCommands() {
    return {
      setGrowthTimeline:
        () =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
          }),
    };
  },
});
