"use client";
import Link from "next/link";
export default function AllPosts() {
  // TODO: fetch posts from db
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">All Posts</h1>
      <div className="bg-white rounded shadow p-4">No posts yet.</div>
      <Link href="/admin/new-post" className="mt-4 inline-block px-4 py-2 bg-primary-500 text-white rounded">New Post</Link>
    </div>
  );
}
