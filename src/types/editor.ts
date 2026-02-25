export interface EditorMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface EditorJson {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: EditorJson[];
  marks?: EditorMark[];
  text?: string;
}
