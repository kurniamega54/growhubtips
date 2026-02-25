"use client";

import { deletePostAction } from "./actions";
import { useTransition } from "react";

export function DeletePostButton({ postId }: { postId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        if (confirm("Delete this post?")) {
          startTransition(() => {
            void deletePostAction(postId);
          });
        }
      }}
      disabled={pending}
      className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
