import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F9F9F9] flex">
      <aside className="w-64 bg-[#2D5A27] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="text-xl font-bold">GrowHub Admin</Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="block px-4 py-3 rounded-lg hover:bg-white/10">Overview</Link>
          <Link href="/admin/all-posts" className="block px-4 py-3 rounded-lg hover:bg-white/10">All Posts</Link>
          <Link href="/admin/new-post" className="block px-4 py-3 rounded-lg hover:bg-white/10">New Post</Link>
          <Link href="/admin/seo-settings" className="block px-4 py-3 rounded-lg hover:bg-white/10">SEO Settings</Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link href="/" className="text-sm text-white/70 hover:text-white">Back to site</Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
