"use client";
import { useRouter } from "next/navigation";
export default function Preview() {
  const router = useRouter();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Preview</h1>
      <button onClick={() => router.back()} className="px-4 py-2 bg-primary-500 text-white rounded">Back</button>
      {/* TODO: Render post preview here */}
    </div>
  );
}
