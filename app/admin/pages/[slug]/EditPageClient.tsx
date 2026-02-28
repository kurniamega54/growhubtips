"use client";

import React, { useState, useTransition } from "react";
import { Editor, type EditorJson } from "../../new-post/Editor";
import { updatePageContent } from "@/app/admin/server-actions/pages";
import { Save, Eye } from "lucide-react";

type Props = {
  slug: "about" | "contact" | "privacy" | "affiliate";
  initial: {
    id?: string;
    title: string;
    metaDescription?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    heroImage?: string;
    content: EditorJson | null;
    status?: string;
  };
  onSaved?: (res: any) => void;
};

export default function EditPageClient({ slug, initial, onSaved }: Props) {
  const [data, setData] = useState(() => ({ ...initial }));
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const res = await updatePageContent(slug, {
        title: data.title,
        metaDescription: data.metaDescription || "",
        heroTitle: data.heroTitle || "",
        heroSubtitle: data.heroSubtitle || "",
        heroImage: data.heroImage,
        content: (data.content as any) || {},
        status: (data.status as any) || "draft",
      });
      onSaved?.(res);
      // no return value, transition callback should be void
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-primary-700 mb-2">Page Title</label>
        <input
          className="w-full px-4 py-2 rounded-lg border border-primary-200"
          value={data.title}
          onChange={(e) => setData((d) => ({ ...d, title: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary-700 mb-2">Page Content</label>
        <Editor
          value={data.content}
          onChange={(json) => setData((d) => ({ ...d, content: json }))}
          placeholder="Start writing your page content..."
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-primary-100 text-primary-700 hover:bg-primary-200 transition disabled:opacity-50"
        >
          <Save size={16} />
          Save Draft
        </button>
        <button
          onClick={() => {
            setData((d) => ({ ...d, status: "published" }));
            handleSave();
          }}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-primary-600 text-white hover:bg-primary-700 transition disabled:opacity-50"
        >
          <Eye size={16} />
          Publish
        </button>
      </div>
    </div>
  );
}
