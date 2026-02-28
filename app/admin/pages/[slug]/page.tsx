"use client";

import { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { type EditorJson } from "../../new-post/Editor";
import EditPageClient from "./EditPageClient";
import { updatePageContent, getPageContent } from "../../server-actions/pages";
import {
  ChevronLeft,
  Save,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type PageSlug = "about" | "contact" | "privacy" | "affiliate";

interface PageEditorState {
  id?: string;
  title: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  contentJson: EditorJson | null;
  status: "draft" | "published" | "archived";
  lastSavedAt?: string;
  isSaving?: boolean;
  syncStatus?: "idle" | "saving" | "saved" | "error";
  syncMessage?: string;
}

async function fetchPageData(slug: PageSlug) {
  const result = await getPageContent(slug);
  if (result.success && result.data) {
    return result.data;
  }
  return null;
}

export default function PageEditorPage({ params }: { params: { slug: PageSlug } }) {
  const router = useRouter();
  const slug = params.slug as PageSlug;
  
  const [pageState, setPageState] = useState<PageEditorState>({
    title: "",
    metaDescription: "",
    heroTitle: "",
    heroSubtitle: "",
    contentJson: null,
    status: "draft",
    syncStatus: "idle",
  });

  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  // Load page data on mount
  useEffect(() => {
    setIsLoading(true);
    fetchPageData(slug).then((data) => {
      if (data) {
        setPageState((prev) => ({
          ...prev,
          id: data.id,
          title: data.title,
          metaDescription: data.metaDescription,
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          heroImage: data.heroImage,
          contentJson: (data.content || {}) as EditorJson,
          status: (data.status as "draft" | "published" | "archived") || "draft",
        }));
      }
      setIsLoading(false);
    });
  }, [slug]);

  const handleSave = () => {
    setPageState((prev) => ({
      ...prev,
      syncStatus: "saving",
      syncMessage: "Saving your changes...",
    }));

    startTransition(async () => {
      const result = await updatePageContent(slug, {
        title: pageState.title,
        metaDescription: pageState.metaDescription,
        heroTitle: pageState.heroTitle,
        heroSubtitle: pageState.heroSubtitle,
        heroImage: pageState.heroImage,
        content: pageState.contentJson || {},
        status: pageState.status,
      });

      if (result.success) {
        setPageState((prev) => ({
          ...prev,
          id: result.data?.id || prev.id,
          syncStatus: "saved",
          syncMessage: result.message,
          lastSavedAt: new Date().toLocaleString(),
        }));

        // Reset status after 3 seconds
        setTimeout(() => {
          setPageState((prev) => ({
            ...prev,
            syncStatus: "idle",
            syncMessage: undefined,
          }));
        }, 3000);
      } else {
        setPageState((prev) => ({
          ...prev,
          syncStatus: "error",
          syncMessage: result.message,
        }));
      }
    });
  };

  const handlePublish = () => {
    if (!pageState.title || !pageState.contentJson) {
      setPageState((prev) => ({
        ...prev,
        syncStatus: "error",
        syncMessage: "Title and content are required to publish",
      }));
      return;
    }

    startTransition(async () => {
      const result = await updatePageContent(slug, {
        title: pageState.title,
        metaDescription: pageState.metaDescription,
        heroTitle: pageState.heroTitle,
        heroSubtitle: pageState.heroSubtitle,
        heroImage: pageState.heroImage,
        content: pageState.contentJson || {},
        status: "published",
      });

      if (result.success) {
        setPageState((prev) => ({
          ...prev,
          status: "published",
          syncStatus: "saved",
          syncMessage: result.message,
          lastSavedAt: new Date().toLocaleString(),
        }));

        setTimeout(() => {
          setPageState((prev) => ({
            ...prev,
            syncStatus: "idle",
            syncMessage: undefined,
          }));
        }, 3000);
      } else {
        setPageState((prev) => ({
          ...prev,
          syncStatus: "error",
          syncMessage: result.message,
        }));
      }
    });
  };

  const pageTitleMap = {
    about: "About Us",
    contact: "Contact Us",
    privacy: "Privacy Policy",
    affiliate: "Affiliate Program",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F1F3F0]">
        <div className="text-center space-y-4">
          <div className="animate-spin">🌱</div>
          <p className="text-primary-700 font-medium">Loading {pageTitleMap[slug]}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#F1F3F0]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-primary-100 shadow-sm">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 hover:bg-primary-50 rounded-lg transition"
              title="Back to dashboard"
            >
              <ChevronLeft size={20} className="text-primary-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-primary-900">
                {pageTitleMap[slug]} Editor
              </h1>
              <p className="text-sm text-neutral-500">Manage your '{slug}' page content</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {pageState.lastSavedAt && (
              <div className="flex items-center gap-2 text-xs text-neutral-500 px-3 py-2 rounded-lg bg-neutral-50">
                <Clock size={14} />
                <span>Saved {pageState.lastSavedAt}</span>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-primary-100 text-primary-700 hover:bg-primary-200 transition disabled:opacity-50"
            >
              <Save size={16} />
              Save Draft
            </button>

            <button
              onClick={handlePublish}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-primary-600 text-white hover:bg-primary-700 transition disabled:opacity-50"
            >
              <Eye size={16} />
              Publish
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {pageState.syncMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`px-8 py-2 flex items-center gap-2 text-sm font-medium border-t ${
              pageState.syncStatus === "saved"
                ? "bg-green-50 border-green-200 text-green-700"
                : pageState.syncStatus === "error"
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-blue-50 border-blue-200 text-blue-700"
            }`}
          >
            {pageState.syncStatus === "saved" && (
              <CheckCircle size={16} className="text-green-600" />
            )}
            {pageState.syncStatus === "error" && (
              <AlertCircle size={16} className="text-red-600" />
            )}
            {pageState.syncStatus === "saving" && (
              <div className="animate-spin">🌱</div>
            )}
            {pageState.syncMessage}
          </motion.div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="flex gap-8 p-8 max-w-7xl mx-auto">
          {/* Editor Section */}
          <div className="flex-1 space-y-6">
            {/* Page Meta Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-primary-700 mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  value={pageState.title}
                  onChange={(e) =>
                    setPageState((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="e.g., About GrowHubTips"
                  className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={pageState.metaDescription}
                  onChange={(e) =>
                    setPageState((prev) => ({
                      ...prev,
                      metaDescription: e.target.value,
                    }))
                  }
                  placeholder="SEO meta description (max 160 chars)"
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {pageState.metaDescription.length}/160 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary-700 mb-2">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={pageState.heroTitle}
                  onChange={(e) =>
                    setPageState((prev) => ({
                      ...prev,
                      heroTitle: e.target.value,
                    }))
                  }
                  placeholder="Main page heading"
                  className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary-700 mb-2">
                  Hero Subtitle
                </label>
                <textarea
                  value={pageState.heroSubtitle}
                  onChange={(e) =>
                    setPageState((prev) => ({
                      ...prev,
                      heroSubtitle: e.target.value,
                    }))
                  }
                  placeholder="Subtitle or tagline"
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary-700 mb-2">
                  Status
                </label>
                <select
                  value={pageState.status}
                  onChange={(e) =>
                    setPageState((prev) => ({
                      ...prev,
                      status: e.target.value as "draft" | "published" | "archived",
                    }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:border-primary-500 focus:outline-none"
                >
                  <option value="draft">🌱 Draft</option>
                  <option value="published">🌿 Published</option>
                  <option value="archived">📦 Archived</option>
                </select>
              </div>
            </div>

            {/* Editor */}
            <div>
              <label className="block text-sm font-semibold text-primary-700 mb-2">
                Page Content
              </label>
              <EditPageClient
                slug={slug}
                initial={{
                  id: pageState.id,
                  title: pageState.title,
                  metaDescription: pageState.metaDescription,
                  heroTitle: pageState.heroTitle,
                  heroSubtitle: pageState.heroSubtitle,
                  heroImage: pageState.heroImage,
                  content: (pageState.contentJson || {}) as EditorJson,
                  status: pageState.status,
                }}
                onSaved={(res) => {
                  if (res?.success) {
                    setPageState((prev) => ({
                      ...prev,
                      syncStatus: "saved",
                      syncMessage: res.message,
                      lastSavedAt: new Date().toLocaleString(),
                    }));
                    setTimeout(() => {
                      setPageState((prev) => ({ ...prev, syncStatus: "idle", syncMessage: undefined }));
                    }, 3000);
                  } else {
                    setPageState((prev) => ({ ...prev, syncStatus: "error", syncMessage: res?.message }));
                  }
                }}
              />
            </div>
          </div>

          {/* SEO Sidebar */}
          {/* <div className="w-80">
            <SeoSidebar
              title={pageState.title}
              slug={slug}
              focusKeyword={pageState.metaDescription}
              seoTitle={pageState.title}
              metaDescription={pageState.metaDescription}
              contentJson={pageState.contentJson}
              isSaving={isPending}
              lastSavedAt={pageState.lastSavedAt}
              onSeoScoreChange={(score) =>
                setPageState((prev) => ({
                  ...prev,
                  localseoScore: score,
                }))
              }
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}
