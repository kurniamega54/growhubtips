"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

const AffiliateComponent = ({ node, updateAttributes }: { node: { attrs: Record<string, string> }; updateAttributes: (a: Record<string, string>) => void }) => (
  <NodeViewWrapper className="my-6">
    <div className="rounded-2xl border border-primary-200 bg-white p-6 shadow-organic flex gap-6">
      <div className="w-24 h-24 rounded-xl bg-primary-100 shrink-0 flex items-center justify-center overflow-hidden">
        {node.attrs.imageUrl ? <img src={node.attrs.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-4xl">📦</span>}
      </div>
      <div className="flex-1 space-y-2">
        <input value={node.attrs.title || ""} onChange={e => updateAttributes({ title: e.target.value })} className="w-full font-bold text-primary-700" placeholder="Product title" />
        <input value={node.attrs.imageUrl || ""} onChange={e => updateAttributes({ imageUrl: e.target.value })} className="w-full text-sm text-primary-600" placeholder="Image URL" />
        <div className="flex gap-1">
          {[1,2,3,4,5].map(i => <button key={i} type="button" onClick={() => updateAttributes({ rating: String(i) })} className={`text-lg ${(Number(node.attrs.rating) || 0) >= i ? "text-amber-500" : "text-neutral-300"}`}>★</button>)}
        </div>
        <div className="flex gap-2 pt-2">
          <input value={node.attrs.ctaText || ""} onChange={e => updateAttributes({ ctaText: e.target.value })} className="px-3 py-1 rounded border text-sm" placeholder="Button text" />
          <input value={node.attrs.ctaUrl || ""} onChange={e => updateAttributes({ ctaUrl: e.target.value })} className="flex-1 px-3 py-1 rounded border text-sm" placeholder="Button URL" />
        </div>
      </div>
    </div>
  </NodeViewWrapper>
);

export const AffiliateProduct = Node.create({
  name: "affiliateProduct",
  group: "block",
  atom: true,
  addAttributes() { return { imageUrl: { default: "" }, title: { default: "" }, rating: { default: "0" }, ctaText: { default: "Buy Now" }, ctaUrl: { default: "" } }; },
  parseHTML() { return [{ tag: "div[data-type=affiliate-product]" }]; },
  renderHTML({ HTMLAttributes }) { return ["div", mergeAttributes({ "data-type": "affiliate-product" }, HTMLAttributes)]; },
  addNodeView() { return ReactNodeViewRenderer(AffiliateComponent); },
});
