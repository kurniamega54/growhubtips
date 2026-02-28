"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface PostResult {
  title: string;
  slug: string;
  excerpt?: string;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PostResult[]>([]);
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setShow(false);
      return;
    }
    setShow(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    }, 300);
  }, [query]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form className="flex items-center bg-white rounded-full shadow-md p-2">
        <input
          type="text"
          placeholder="Search plant tips..."
          className="flex-1 px-4 py-2 bg-transparent outline-none text-[#2D5A27]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length) setShow(true);
          }}
        />
        <button
          type="submit"
          className="bg-[#8E9775] text-white rounded-full px-4 py-2 font-semibold hover:bg-[#2D5A27] transition"
        >
          Search
        </button>
      </form>
      {show && results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-primary-500 rounded-lg shadow-lg max-h-60 overflow-auto">
          {results.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block px-4 py-2 hover:bg-primary-50 text-primary-700"
                onClick={() => setShow(false)}
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
