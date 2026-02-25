"use client";
import { createContext, useState, useCallback } from "react";

export type EditorContextType = {
  title: string;
  setTitle: (t: string) => void;
  syncStatus: string;
  setSyncStatus: (s: string) => void;
  onPublish: () => void;
  onPreview: () => void;
  contentJson: any;
  setContentJson: (c: any) => void;
  seoScore: number;
  setSeoScore: (n: number) => void;
};

export const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState("");
  const [syncStatus, setSyncStatus] = useState("🍃 Draft Saved");
  const [contentJson, setContentJson] = useState<any>(null);
  const [seoScore, setSeoScore] = useState(0);

  const onPublish = useCallback(() => {
    // TODO: Implement publish logic
    setSyncStatus("✅ Published!");
    setTimeout(() => setSyncStatus("🍃 Draft Saved"), 2000);
  }, []);
  const onPreview = useCallback(() => {
    // TODO: Implement preview logic
    window.open("/preview", "_blank");
  }, []);

  return (
    <EditorContext.Provider
      value={{
        title,
        setTitle,
        syncStatus,
        setSyncStatus,
        onPublish,
        onPreview,
        contentJson,
        setContentJson,
        seoScore,
        setSeoScore,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}
export default EditorContext;
