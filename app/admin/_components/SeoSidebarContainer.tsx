"use client";

import { useContext } from "react";
import { EditorContext } from "./EditorContext";
import { SeoSidebar } from "../new-post/SeoSidebar";

/**
 * SEO Sidebar Container
 * Connects SeoSidebar to EditorContext for state sharing
 */
export default function SeoSidebarContainer() {
  const context = useContext(EditorContext);

  if (!context) {
    // If no context available, render empty
    return (
      <div className="p-4 text-center text-sm text-neutral-500">
        <p>SEO Sidebar ready</p>
      </div>
    );
  }

  return (
    <SeoSidebar
      title={context.title}
      slug=""
      focusKeyword=""
      seoTitle={context.title}
      metaDescription=""
      contentJson={context.contentJson}
      isSaving={false}
      lastSavedAt={new Date().toISOString()}
      onSeoScoreChange={(score) => context.setSeoScore(score)}
    />
  );
}
