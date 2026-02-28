/**
 * Editor JSON Type - Tiptap Editor Content
 * Used for storing rich text content as JSON
 */

export interface EditorJson {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: EditorJson[];
  marks?: EditorJsonMark[];
  text?: string;
}

export interface EditorJsonMark {
  type: string;
  attrs?: Record<string, unknown>;
}
