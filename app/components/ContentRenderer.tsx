import Image from "next/image";
import React, { createElement } from "react";

export type ContentNode = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: ContentNode[];
  text?: string;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
};

type ContentRendererProps = {
  content: ContentNode | null;
};

function renderMarks(text: React.ReactNode, marks: ContentNode["marks"]) {
  if (!marks || marks.length === 0) return text;

  return marks.reduce((acc, mark) => {
    if (mark.type === "bold") return <strong>{acc}</strong>;
    if (mark.type === "italic") return <em>{acc}</em>;
    if (mark.type === "underline") return <u>{acc}</u>;
    if (mark.type === "highlight") return <mark className="bg-accent-500/20">{acc}</mark>;
    if (mark.type === "link") {
      const href = String(mark.attrs?.href || "#");
      return (
        <a href={href} className="text-accent-600 underline" rel="noopener noreferrer">
          {acc}
        </a>
      );
    }
    return acc;
  }, text);
}

function renderChildren(nodes?: ContentNode[]) {
  return (nodes || []).map((node, index) => <React.Fragment key={index}>{renderNode(node)}</React.Fragment>);
}

function getEmbedUrl(platform: string, url: string) {
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

function renderNode(node: ContentNode): React.ReactNode {
  const attrs = node.attrs || {};
  const textAlign = typeof attrs.textAlign === "string" ? (attrs.textAlign as string) : undefined;

  if (node.type === "text") {
    return renderMarks(node.text || "", node.marks);
  }

  if (node.type === "paragraph") {
    const style: React.CSSProperties = {};
    if (textAlign && ["left", "center", "right", "justify"].includes(textAlign)) {
      style.textAlign = textAlign as React.CSSProperties["textAlign"];
    }
    return <p style={style}>{renderChildren(node.content)}</p>;
  }

  if (node.type === "heading") {
    const level = Math.min(3, Math.max(1, Number(attrs.level || 2)));
    const style: React.CSSProperties = {};
    if (textAlign && ["left", "center", "right", "justify"].includes(textAlign)) {
      style.textAlign = textAlign as React.CSSProperties["textAlign"];
    }
    return createElement(`h${level}`, { style }, renderChildren(node.content));
  }

  if (node.type === "bulletList") {
    return <ul className="list-disc pl-6">{renderChildren(node.content)}</ul>;
  }

  if (node.type === "orderedList") {
    return <ol className="list-decimal pl-6">{renderChildren(node.content)}</ol>;
  }

  if (node.type === "listItem") {
    return <li>{renderChildren(node.content)}</li>;
  }

  if (node.type === "blockquote") {
    return (
      <blockquote className="border-l-4 border-primary-300 pl-4 italic text-primary-700">
        {renderChildren(node.content)}
      </blockquote>
    );
  }

  if (node.type === "hardBreak") {
    return <br />;
  }

  if (node.type === "table") {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border border-primary-200 text-sm">
          <tbody>{renderChildren(node.content)}</tbody>
        </table>
      </div>
    );
  }

  if (node.type === "tableRow") {
    return <tr>{renderChildren(node.content)}</tr>;
  }

  if (node.type === "tableHeader") {
    return (
      <th className="border border-primary-200 bg-primary-50 px-3 py-2 text-left">
        {renderChildren(node.content)}
      </th>
    );
  }

  if (node.type === "tableCell") {
    return (
      <td className="border border-primary-200 px-3 py-2">
        {renderChildren(node.content)}
      </td>
    );
  }

  if (node.type === "smartImage") {
    const src = String(attrs.src || "");
    const alt = String(attrs.alt || "");
    const caption = String(attrs.caption || "");
    if (!src) return null;
    return (
      <figure className="my-6">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          sizes="(max-width: 768px) 100vw, 720px"
          className="rounded-2xl"
          unoptimized
        />
        {caption && <figcaption className="mt-2 text-sm text-neutral-500">{caption}</figcaption>}
      </figure>
    );
  }

  if (node.type === "embedBlock") {
    const url = String(attrs.url || "");
    const platform = String(attrs.platform || "youtube");
    const embedUrl = url ? getEmbedUrl(platform, url) : "";
    if (!embedUrl) return null;
    return (
      <div className="my-6 overflow-hidden rounded-2xl border border-primary-100">
        <iframe
          src={embedUrl}
          className="w-full aspect-video"
          title="Embedded media"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (node.type === "plantCareCard") {
    return (
      <section className="my-6 rounded-2xl border border-primary-200 bg-primary-50 p-6 shadow-organic">
        <h3 className="font-heading text-lg font-semibold text-primary-700 mb-4">Plant Care Card</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div><span className="font-semibold">Scientific Name:</span> {String(attrs.scientificName || "-")}</div>
          <div><span className="font-semibold">Sunlight:</span> {String(attrs.sunlight || "-")}</div>
          <div><span className="font-semibold">Water:</span> {String(attrs.waterFrequency || "-")}</div>
          <div><span className="font-semibold">Soil:</span> {String(attrs.soilType || "-")}</div>
          <div><span className="font-semibold">Pet Safety:</span> {String(attrs.petSafety || "-")}</div>
        </div>
      </section>
    );
  }

  if (node.type === "proTipCallout") {
    return (
      <aside className="my-6 rounded-2xl border-l-4 border-primary-500 bg-primary-50 p-6 shadow-organic">
        <div className="flex gap-3">
          <span className="text-2xl">🍃</span>
          <div>
            <h4 className="font-semibold text-primary-700 mb-2">Pro Tip</h4>
            <p className="text-sm text-primary-700">{String(attrs.content || "")}</p>
          </div>
        </div>
      </aside>
    );
  }

  if (node.type === "growthTimeline") {
    const steps = Array.isArray(attrs.steps) ? (attrs.steps as string[]) : [];
    return (
      <section className="my-6 rounded-2xl border border-primary-200 bg-white p-6 shadow-organic">
        <h3 className="font-heading text-lg font-semibold text-primary-700 mb-4">Growth Timeline</h3>
        <ol className="space-y-2 text-sm">
          {steps.map((step, index) => (
            <li key={index} className="flex gap-2">
              <span className="font-semibold">{index + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return renderChildren(node.content);
}

export function ContentRenderer({ content }: ContentRendererProps) {
  if (!content) return null;
  return (
    <article className="prose prose-lg max-w-none">
      {renderNode(content)}
    </article>
  );
}
