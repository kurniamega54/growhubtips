"use client";
import { useState } from "react";
export default function MediaLibrary() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Media Library</h1>
      <input type="file" multiple onChange={e => setFiles(Array.from(e.target.files || []))} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {files.map((file, i) => (
          <div key={i} className="border rounded-lg p-2 bg-white shadow">
            <span className="block text-xs mb-2">{file.name}</span>
            <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-32 object-cover rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
