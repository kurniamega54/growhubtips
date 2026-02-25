"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

type GrowthTimelineAttrs = {
  steps?: string[];
};

function GrowthTimelineComponent({
  node,
  updateAttributes,
}: {
  node: { attrs: GrowthTimelineAttrs };
  updateAttributes: (attrs: GrowthTimelineAttrs) => void;
}) {
  const steps = Array.isArray(node.attrs.steps) ? node.attrs.steps : [];

  return (
    <NodeViewWrapper className="my-6">
      <div className="rounded-2xl border border-primary-200 bg-white p-6 shadow-organic">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🪴</span>
          <h4 className="font-heading text-lg font-semibold text-primary-700">Growth Timeline</h4>
        </div>
        <textarea
          value={steps.join("\n")}
          onChange={(e) =>
            updateAttributes({
              steps: e.target.value
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          placeholder="Add one step per line..."
          className="w-full min-h-[120px] rounded-lg border border-primary-200 px-3 py-2 text-sm"
          aria-label="Growth timeline steps"
        />
        {steps.length > 0 && (
          <ol className="mt-4 space-y-2 text-sm text-primary-700">
            {steps.map((step, index) => (
              <li key={index} className="flex gap-2">
                <span className="font-semibold">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </NodeViewWrapper>
  );
}

export const GrowthTimeline = Node.create({
  name: "growthTimeline",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      steps: { default: [] },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-type=growth-timeline]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ "data-type": "growth-timeline" }, HTMLAttributes),
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(GrowthTimelineComponent);
  },
});
