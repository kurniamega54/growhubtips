"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema, type CreatePostInput } from "@/lib/validations/post";
import { autoSavePostAction, createPostAction } from "../actions";
import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Editor, type EditorJson } from "./Editor";
import { SeoSidebar } from "./SeoSidebar";
import MediaPicker from "../components/MediaPicker";
import { Image as ImgIcon } from "lucide-react";
import Image from "next/image";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function NewPostForm({
  categories,
  onSyncStatusChange,
}: {
  categories: { id: string; name: string; slug: string }[];
  onSyncStatusChange?: (status: "idle" | "saving" | "saved") => void;
}) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: Record<string, string[]> } | null, formData: FormData) =>
      createPostAction(formData) as Promise<{ error?: Record<string, string[]> } | null>,
    null
  );

  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema) as never,
    defaultValues: { status: "draft" },
  });

  const [contentJson, setContentJson] = useState<EditorJson | null>(null);
  const [postId, setPostId] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [seoScore, setSeoScore] = useState<number>(0);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerMode, setMediaPickerMode] = useState<"editor" | "featured">("editor");
  const [mediaPickerCallback, setMediaPickerCallback] = useState<((url: string, alt: string) => void) | null>(null);
  const [featuredImage, setFeaturedImage] = useState<{ id: string; url: string; alt: string } | null>(null);
  const dirtyRef = useRef(false);

  const title = watch("title");
  const slug = watch("slug");

  useEffect(() => {
    if (title && !slug) setValue("slug", slugify(title));
  }, [title, slug, setValue]);

  useEffect(() => {
    const subscription = watch(() => {
      dirtyRef.current = true;
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (contentJson) dirtyRef.current = true;
  }, [contentJson]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!dirtyRef.current) return;
      const values = getValues();
      if (!values.title || !values.slug) return;

      onSyncStatusChange?.("saving");

      startSaving(async () => {
        const result = await autoSavePostAction({
          postId,
          title: values.title,
          slug: values.slug,
          excerpt: values.excerpt,
          contentJson: contentJson ?? undefined,
          focusKeyword: values.focusKeyword,
          seoTitle: values.seoTitle,
          metaDescription: values.metaDescription,
          seoScore,
          featuredImageId: featuredImage?.id,
        });

        if (result?.postId) setPostId(result.postId);
        if (result?.lastSavedAt) {
          setLastSavedAt(new Date(result.lastSavedAt).toLocaleTimeString());
        }
        if (!result?.error) {
          dirtyRef.current = false;
          onSyncStatusChange?.("saved");
          // Reset to idle after 2 seconds
          setTimeout(() => onSyncStatusChange?.("idle"), 2000);
        }
      });
    }, 20000);

    return () => clearInterval(timer);
  }, [contentJson, getValues, postId, startSaving, seoScore, onSyncStatusChange, featuredImage]);

  const seoTitle = watch("seoTitle") ?? title ?? "";
  const metaDesc = watch("metaDescription") ?? "";
  const contentJsonString = useMemo(
    () => (contentJson ? JSON.stringify(contentJson) : ""),
    [contentJson]
  );

  return (
    <form action={formAction} className="flex gap-8">
      <div className="flex-1 space-y-6">
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">Title</label>
          <input
            {...register("title")}
            className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:border-primary-500 focus:outline-none"
            placeholder="Post title"
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">Slug</label>
          <input
            {...register("slug")}
            className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:border-primary-500 focus:outline-none"
            placeholder="url-slug"
          />
          {errors.slug && <p className="text-red-600 text-sm mt-1">{errors.slug.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">Excerpt</label>
          <textarea
            {...register("excerpt")}
            rows={2}
            className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:border-primary-500 focus:outline-none"
            placeholder="Short summary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">Content</label>
          <Editor
            value={contentJson}
            onChange={setContentJson}
            placeholder="Write your story with / to insert blocks..."
            onOpenImagePicker={(callback) => {
              setMediaPickerCallback(() => callback);
              setMediaPickerMode("editor");
              setMediaPickerOpen(true);
            }}
          />
          {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content.message}</p>}
          <input type="hidden" name="contentJson" value={contentJsonString} />
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">Featured Image</label>
          <div className="relative border-2 border-dashed border-primary-200 rounded-lg p-4 bg-primary-50">
            {featuredImage ? (
              <div className="space-y-3">
                <div className="relative w-full h-48">
                  <Image
                    src={featuredImage.url}
                    alt={featuredImage.alt}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded"
                  />
                </div>
                <div className="text-sm text-gray-600">{featuredImage.alt}</div>
                <button
                  type="button"
                  onClick={() => {
                    setMediaPickerMode("featured");
                    setMediaPickerOpen(true);
                  }}
                  className="px-3 py-2 text-sm bg-primary-500 text-white rounded hover:bg-primary-600"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <div className="text-center">
                <ImgIcon className="mx-auto text-primary-300 mb-3" size={32} />
                <p className="text-sm text-gray-600 mb-3">Set a thumbnail for your post</p>
                <button
                  type="button"
                  onClick={() => {
                    setMediaPickerMode("featured");
                    setMediaPickerOpen(true);
                  }}
                  className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
                >
                  Select Image
                </button>
              </div>
            )}
          </div>
          {featuredImage && <input type="hidden" name="featuredImageId" value={featuredImage.id} />}
        </div>
          <select
            {...register("categoryId")}
            className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:border-primary-500 focus:outline-none"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            name="status"
            value="draft"
            disabled={isPending}
            className="px-6 py-2 rounded-lg border border-primary-300 text-primary-700 hover:bg-primary-50 disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="submit"
            name="status"
            value="published"
            disabled={isPending}
            className="px-6 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50"
          >
            Publish
          </button>
        </div>
        {state?.error?._form && (
          <p className="text-red-600 text-sm">{state.error._form[0]}</p>
        )}
      </div>
      <SeoSidebar
        title={title ?? ""}
        slug={slug ?? ""}
        focusKeyword={watch("focusKeyword") ?? ""}
        seoTitle={seoTitle}
        metaDescription={metaDesc}
        contentJson={contentJson}
        isSaving={isSaving}
        onSeoScoreChange={setSeoScore}
        lastSavedAt={lastSavedAt}
      />

      <MediaPicker
        open={mediaPickerOpen}
        onClose={() => {
          setMediaPickerOpen(false);
          setMediaPickerCallback(null);
        }}
        onSelect={(item, altText) => {
          if (mediaPickerMode === "editor" && mediaPickerCallback) {
            mediaPickerCallback(item.url, altText);
          } else if (mediaPickerMode === "featured") {
            setFeaturedImage({ id: item.id, url: item.url, alt: altText });
            dirtyRef.current = true;
          }
          setMediaPickerOpen(false);
          setMediaPickerCallback(null);
        }}
        requireAltText={true}
      />
    </form>
  );
}
