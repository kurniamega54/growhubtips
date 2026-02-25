"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

export type EmbedPlatform = "youtube" | "instagram" | "x";

type EmbedAttrs = {
  url?: string;
  platform?: EmbedPlatform;
};

function getEmbedUrl(platform: EmbedPlatform, url: string) {
  if (platform === "youtube") {
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
    if (match?.[1]) return `https://www.youtube.com/embed/${match[1]}`;
  }
  if (platform === "instagram") {
    const match = url.match(/instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/);
    if (match?.[1]) return `https://www.instagram.com/p/${match[1]}/embed`;
  }
  if (platform === "x") {
    return `https://twitframe.com/show?url=${encodeURIComponent(url)}`;
  }
  return url;
}

function EmbedBlockComponent({
  node,
  updateAttributes,
}: {
  node: { attrs: EmbedAttrs };
  updateAttributes: (attrs: EmbedAttrs) => void;
}) {
  const platform = node.attrs.platform || "youtube";
  const url = node.attrs.url || "";
  const embedUrl = url ? getEmbedUrl(platform, url) : "";

  return (
    <NodeViewWrapper className="my-6">
      <div className="rounded-2xl border border-primary-200 bg-white p-5 shadow-organic space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-heading text-base font-semibold text-primary-700">Embed</h4>
          <select
            value={platform}
            onChange={(e) => updateAttributes({ ...node.attrs, platform: e.target.value as EmbedPlatform })}
            className="rounded-lg border border-primary-200 px-2 py-1 text-xs"
            aria-label="Embed platform"
          >
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
            <option value="x">X (Twitter)</option>
          </select>
        </div>
        <input
          value={url}
          onChange={(e) => updateAttributes({ ...node.attrs, url: e.target.value })}
          placeholder="Paste embed URL"
          className="w-full rounded-lg border border-primary-200 px-3 py-2 text-sm"
          aria-label="Embed URL"
        />
        {embedUrl ? (
          <div className="relative w-full overflow-hidden rounded-xl border border-primary-100">
            <iframe
              src={embedUrl}
              className="w-full aspect-video"
              title="Embed preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-primary-200 px-4 py-6 text-center text-sm text-primary-500">
            Paste a URL to preview the embed
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}

export const EmbedBlock = Node.create({
  name: "embedBlock",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      url: { default: "" },
      platform: { default: "youtube" },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-type=embed-block]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ "data-type": "embed-block" }, HTMLAttributes),
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(EmbedBlockComponent);
  },
});
