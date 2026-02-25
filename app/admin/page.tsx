import { getDashboardStats, getRecentPostsWithSeo } from "@/lib/queries";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [stats, recentPosts] = await Promise.all([
    getDashboardStats(),
    getRecentPostsWithSeo(5),
  ]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-primary-700 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-organic p-6 border border-primary-100">
          <p className="text-sm text-primary-600 mb-1">Total Posts</p>
          <p className="text-3xl font-bold text-primary-700">{stats.totalPosts}</p>
        </div>
        <div className="bg-white rounded-xl shadow-organic p-6 border border-primary-100">
          <p className="text-sm text-primary-600 mb-1">Total Views</p>
          <p className="text-3xl font-bold text-primary-700">{stats.totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-organic p-6 border border-primary-100">
          <p className="text-sm text-primary-600 mb-1">Quick Draft</p>
          <Link href="/admin/new-post" className="inline-flex items-center gap-2 text-accent-500 font-semibold hover:text-accent-600">Create new post</Link>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-organic border border-primary-100 overflow-hidden">
        <h2 className="text-lg font-semibold text-primary-700 p-4 border-b border-primary-100">Recent Activity</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-primary-50 text-left text-sm text-primary-600">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">SEO Score</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentPosts.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-primary-500">No posts yet.</td></tr>
            ) : (
              recentPosts.map((post) => (
                <tr key={post.id} className="border-t border-primary-100">
                  <td className="px-4 py-3 font-medium text-primary-700">{post.title}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${post.status === "published" ? "bg-primary-100" : "bg-neutral-200"}`}>{post.status}</span></td>
                  <td className="px-4 py-3">{post.titleScore ?? "-"}</td>
                  <td className="px-4 py-3">{post.viewCount ?? 0}</td>
                  <td className="px-4 py-3">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
