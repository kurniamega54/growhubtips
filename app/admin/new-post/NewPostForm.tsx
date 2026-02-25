"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema, type CreatePostInput } from "@/lib/validations/post";
import { autoSavePostAction, createPostAction } from "../actions";
import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Editor, type EditorJson } from "./Editor";
import { SeoSidebar } from "./SeoSidebar";

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
}: {
  categories: { id: string; name: string; slug: string }[];
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
        });

        if (result?.postId) setPostId(result.postId);
        if (result?.lastSavedAt) {
          setLastSavedAt(new Date(result.lastSavedAt).toLocaleTimeString());
        }
        if (!result?.error) dirtyRef.current = false;
      });
    }, 20000);

    return () => clearInterval(timer);
  }, [contentJson, getValues, postId, startSaving, seoScore]);

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
          />
          {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content.message}</p>}
          <input type="hidden" name="contentJson" value={contentJsonString} />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">Category</label>
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
        contentJson={contentJson as any}
        isSaving={isSaving}
        onSeoScoreChange={setSeoScore}
        lastSavedAt={lastSavedAt}
      />
    </form>
  );
}
