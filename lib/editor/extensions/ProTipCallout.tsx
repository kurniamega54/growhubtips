"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

function ProTipComponent({ node, updateAttributes }: { node: { attrs: Record<string, string> }; updateAttributes: (a: Record<string, string>) => void }) {
  return (
    <NodeViewWrapper className="my-6">
      <div className="rounded-2xl border-l-4 border-primary-500 bg-primary-50 p-6 shadow-organic flex gap-4">
        <span className="text-3xl shrink-0">🌿</span>
        <div className="flex-1">
          <h4 className="font-bold text-primary-700 mb-2">Pro Tip</h4>
          <textarea value={node.attrs.content || ""} onChange={e => updateAttributes({ content: e.target.value })} className="w-full px-3 py-2 rounded border border-primary-200 min-h-[80px]" placeholder="Expert advice..." />
        </div>
      </div>
    </NodeViewWrapper>
  );
}

export const ProTipCallout = Node.create({
  name: "proTipCallout",
  group: "block",
  atom: true,
  addAttributes() { return { content: { default: "" } }; },
  parseHTML() { return [{ tag: "div[data-type=pro-tip]" }]; },
  renderHTML({ HTMLAttributes }) { return ["div", mergeAttributes({ "data-type": "pro-tip" }, HTMLAttributes)]; },
  addNodeView() { return ReactNodeViewRenderer(ProTipComponent); },
});
