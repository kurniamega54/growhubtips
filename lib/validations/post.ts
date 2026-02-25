import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3).max(500),
  slug: z.string().min(2).max(500).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(500).optional(),
  content: z.string().optional(),
  contentJson: z.unknown().optional(),
  categoryId: z.string().uuid().optional().nullable(),
  status: z.enum(["draft", "published"]).optional().default("draft"),
  focusKeyword: z.string().max(255).optional(),
  seoTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
