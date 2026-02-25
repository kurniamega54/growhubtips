"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, ExternalLink, AlertCircle } from "lucide-react";
import type { NodeViewProps } from "@tiptap/react";

type EmbedType = "youtube" | "instagram" | "twitter" | "link" | "unknown";

interface EmbedData {
  url: string;
  type: EmbedType;
  title?: string;
  thumbnail?: string;
  embedHtml?: string;
}

function getEmbedInfo(url: string): EmbedData | null {
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const instagramRegex =
    /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/;
  const twitterRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/;

  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    return {
      url,
      type: "youtube",
      title: "YouTube Video",
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      embedHtml: `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
    };
  }

  const instagramMatch = url.match(instagramRegex);
  if (instagramMatch) {
    return {
      url,
      type: "instagram",
      title: "Instagram Post",
      embedHtml: `<iframe src="https://www.instagram.com/p/${instagramMatch[1]}/embed" width="100%" height="600" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`,
    };
  }

  const twitterMatch = url.match(twitterRegex);
  if (twitterMatch) {
    const tweetId = twitterMatch[1];
    return {
      url,
      type: "twitter",
      title: "Post from X",
      embedHtml: `<blockquote class="twitter-tweet"><a href="${url}"></a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`,
    };
  }

  try {
    new URL(url);
    return {
      url,
      type: "link",
      title: new URL(url).hostname,
    };
  } catch {
    return null;
  }
}

export function EmbedComponent(props: NodeViewProps) {
  const { node, deleteNode } = props;
  const url = node.attrs.url as string;
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [showIframe, setShowIframe] = useState(false);

  const embedInfo = getEmbedInfo(url);

  if (!embedInfo || error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-4 rounded-lg border border-red-200 bg-red-50 p-4"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Invalid embed URL</p>
            <p className="text-sm text-red-700 mt-1 break-all">{url}</p>
            <button
              onClick={deleteNode}
              className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Remove
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (embedInfo.type === "youtube") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-6 rounded-2xl overflow-hidden shadow-organic"
      >
        {!showIframe ? (
          <div
            className="relative w-full bg-black cursor-pointer group"
            style={{ aspectRatio: "16 / 9" }}
            onClick={() => setShowIframe(true)}
          >
            <img
              src={embedInfo.thumbnail}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
              onError={() => setError(true)}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-600 text-white shadow-lg"
              >
                <Play size={24} fill="white" />
              </motion.div>
            </div>
          </div>
        ) : (
          <div
            className="w-full bg-black"
            style={{ aspectRatio: "16 / 9" }}
            dangerouslySetInnerHTML={{ __html: embedInfo.embedHtml || "" }}
          />
        )}
      </motion.div>
    );
  }

  if (embedInfo.type === "instagram") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-6 rounded-2xl overflow-hidden shadow-organic border-2 border-secondary-400"
      >
        <div className="bg-white p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-secondary-600">
            📸 Instagram Post
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-secondary-600 hover:text-secondary-700 font-medium"
          >
            View on Instagram <ExternalLink size={12} />
          </a>
        </div>
        <div className="bg-white p-4">
          {!loaded && (
            <div className="h-96 bg-gradient-to-r from-secondary-100 via-secondary-50 to-secondary-100 animate-pulse rounded" />
          )}
          <div
            className={loaded ? "" : "hidden"}
            dangerouslySetInnerHTML={{ __html: embedInfo.embedHtml || "" }}
            onLoad={() => setLoaded(true)}
          />
        </div>
      </motion.div>
    );
  }

  if (embedInfo.type === "twitter") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-6 rounded-2xl overflow-hidden shadow-organic border-2 border-secondary-400"
      >
        <div className="bg-white p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-secondary-600">
            𝕏 Post
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-secondary-600 hover:text-secondary-700 font-medium"
          >
            View on X <ExternalLink size={12} />
          </a>
        </div>
        <div className="bg-white p-4">
          <div
            dangerouslySetInnerHTML={{ __html: embedInfo.embedHtml || "" }}
          />
        </div>
      </motion.div>
    );
  }

  // Fallback: Link Card
  return (
    <motion.a
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-4 flex items-center gap-3 rounded-lg border border-primary-200 bg-primary-50 p-4 hover:bg-primary-100 transition-colors no-underline group"
    >
      <div className="h-12 w-12 rounded bg-primary-200 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-300 transition-colors">
        <ExternalLink size={20} className="text-primary-700" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-primary-900 truncate">
          {embedInfo.title || "Link"}
        </p>
        <p className="text-xs text-primary-600 truncate">{url}</p>
      </div>
    </motion.a>
  );
}
