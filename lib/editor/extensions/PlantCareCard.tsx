"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

type PlantCareAttrs = {
  scientificName?: string;
  sunlight?: string;
  waterFrequency?: string;
  soilType?: string;
  petSafety?: string;
};

function PlantCareCardComponent({
  node,
  updateAttributes,
}: {
  node: { attrs: PlantCareAttrs };
  updateAttributes: (attrs: PlantCareAttrs) => void;
}) {
  const update = (key: keyof PlantCareAttrs, value: string) =>
    updateAttributes({ ...node.attrs, [key]: value });

  return (
    <NodeViewWrapper className="my-6">
      <div className="rounded-2xl border border-primary-200 bg-primary-50 p-6 shadow-organic">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🌿</span>
          <h4 className="font-heading text-lg font-semibold text-primary-700">Plant Care Card</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            value={node.attrs.scientificName || ""}
            onChange={(e) => update("scientificName", e.target.value)}
            placeholder="Scientific name"
            className="rounded-lg border border-primary-200 px-3 py-2 text-sm"
            aria-label="Scientific name"
          />
          <input
            value={node.attrs.sunlight || ""}
            onChange={(e) => update("sunlight", e.target.value)}
            placeholder="Sunlight"
            className="rounded-lg border border-primary-200 px-3 py-2 text-sm"
            aria-label="Sunlight"
          />
          <input
            value={node.attrs.waterFrequency || ""}
            onChange={(e) => update("waterFrequency", e.target.value)}
            placeholder="Water frequency"
            className="rounded-lg border border-primary-200 px-3 py-2 text-sm"
            aria-label="Water frequency"
          />
          <input
            value={node.attrs.soilType || ""}
            onChange={(e) => update("soilType", e.target.value)}
            placeholder="Soil type"
            className="rounded-lg border border-primary-200 px-3 py-2 text-sm"
            aria-label="Soil type"
          />
          <input
            value={node.attrs.petSafety || ""}
            onChange={(e) => update("petSafety", e.target.value)}
            placeholder="Pet safety"
            className="rounded-lg border border-primary-200 px-3 py-2 text-sm"
            aria-label="Pet safety"
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
}

export const PlantCareCard = Node.create({
  name: "plantCareCard",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      scientificName: { default: "" },
      sunlight: { default: "" },
      waterFrequency: { default: "" },
      soilType: { default: "" },
      petSafety: { default: "" },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-type=plant-care-card]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ "data-type": "plant-care-card" }, HTMLAttributes),
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(PlantCareCardComponent);
  },
});
