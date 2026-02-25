"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useCallback } from "react";

type SmartImageAttrs = {
  src?: string;
  alt?: string;
  caption?: string;
};

function SmartImageComponent({
  node,
  updateAttributes,
}: {
  node: { attrs: SmartImageAttrs };
  updateAttributes: (attrs: SmartImageAttrs) => void;
}) {
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer?.files?.[0];
      if (!file || !file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        updateAttributes({ src: String(reader.result ?? "") });
      };
      reader.readAsDataURL(file);
    },
    [updateAttributes]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return (
    <NodeViewWrapper className="my-6">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="rounded-2xl border border-primary-200 bg-white shadow-organic overflow-hidden"
      >
        <div className="bg-primary-50 px-4 py-3 text-xs font-semibold text-primary-600">
          Smart Image
        </div>
        <div className="p-4 space-y-3">
          {node.attrs.src ? (
            <img
              src={node.attrs.src}
              alt={node.attrs.alt || ""}
              className="w-full rounded-xl object-cover"
            />
          ) : (
            <div className="h-40 rounded-xl border border-dashed border-primary-300 flex items-center justify-center text-primary-500 text-sm">
              Drag and drop an image or paste a URL below
            </div>
          )}
          <input
            value={node.attrs.src || ""}
            onChange={(e) => updateAttributes({ src: e.target.value })}
            placeholder="Image URL"
            className="w-full rounded-lg border border-primary-200 px-3 py-2 text-sm"
            aria-label="Image URL"
          />
          <input
            value={node.attrs.alt || ""}
            onChange={(e) => updateAttributes({ alt: e.target.value })}
            placeholder="Alt text (SEO)"
            className="w-full rounded-lg border border-primary-200 px-3 py-2 text-sm"
            aria-label="Alt text"
          />
          <input
            value={node.attrs.caption || ""}
            onChange={(e) => updateAttributes({ caption: e.target.value })}
            placeholder="Caption"
            className="w-full rounded-lg border border-primary-200 px-3 py-2 text-sm"
            aria-label="Caption"
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
}

export const SmartImage = Node.create({
  name: "smartImage",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: "" },
      alt: { default: "" },
      caption: { default: "" },
    };
  },
  parseHTML() {
    return [{ tag: "figure[data-type=smart-image]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "figure",
      mergeAttributes({ "data-type": "smart-image" }, HTMLAttributes),
      ["img", { src: HTMLAttributes.src, alt: HTMLAttributes.alt }],
      ["figcaption", {}, HTMLAttributes.caption || ""],
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(SmartImageComponent);
  },
});
