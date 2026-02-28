import { getCurrentUser, logoutAction } from "./auth-actions";
import { getDashboardStats, getRecentPostsWithSeo } from "@/lib/queries";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, BookOpen, BarChart3, Settings, FileText } from "lucide-react";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  const [stats, recentPosts] = await Promise.all([
    getDashboardStats(),
    getRecentPostsWithSeo(5),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F9F9] to-[#E8F3E8]">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2D5A27] to-[#3D7A37] rounded-xl flex items-center justify-center">
              <span className="text-xl">🌱</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2D5A27]">GrowHub Admin</h1>
              <p className="text-xs text-neutral-500">Content Management System</p>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-900">{user.name}</p>
              <p className="text-xs text-neutral-500">{user.email}</p>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-[#2D5A27] mb-2">
              Welcome back, {user.name.split(" ")[0]}! 🎉
            </h2>
            <p className="text-neutral-600">
              You're logged in as an <span className="font-semibold text-[#2D5A27]">Administrator</span>. 
              Here's your home base for managing GrowHubTips content.
            </p>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="mb-12">
          <h3 className="text-xl font-bold text-[#2D5A27] mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* New Post */}
            <Link href="/admin/new-post">
              <div className="h-full bg-white rounded-xl border border-neutral-200 hover:border-[#2D5A27]/50 hover:shadow-lg p-6 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-[#2D5A27]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#2D5A27]/20 transition">
                  <FileText className="text-[#2D5A27]" size={24} />
                </div>
                <h4 className="font-semibold text-neutral-900 mb-1">Create Post</h4>
                <p className="text-sm text-neutral-600">Write and publish new content</p>
              </div>
            </Link>

            {/* View Posts */}
            <Link href="/admin/all-posts">
              <div className="h-full bg-white rounded-xl border border-neutral-200 hover:border-[#2D5A27]/50 hover:shadow-lg p-6 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-[#2D5A27]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#2D5A27]/20 transition">
                  <BookOpen className="text-[#2D5A27]" size={24} />
                </div>
                <h4 className="font-semibold text-neutral-900 mb-1">All Posts</h4>
                <p className="text-sm text-neutral-600">View and manage your articles</p>
              </div>
            </Link>

            {/* Media Library */}
            <Link href="/admin/media">
              <div className="h-full bg-white rounded-xl border border-neutral-200 hover:border-[#2D5A27]/50 hover:shadow-lg p-6 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-[#2D5A27]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#2D5A27]/20 transition">
                  <BarChart3 className="text-[#2D5A27]" size={24} />
                </div>
                <h4 className="font-semibold text-neutral-900 mb-1">Media Library</h4>
                <p className="text-sm text-neutral-600">Manage images and files</p>
              </div>
            </Link>

            {/* Settings */}
            <Link href="/admin/settings">
              <div className="h-full bg-white rounded-xl border border-neutral-200 hover:border-[#2D5A27]/50 hover:shadow-lg p-6 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-[#2D5A27]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#2D5A27]/20 transition">
                  <Settings className="text-[#2D5A27]" size={24} />
                </div>
                <h4 className="font-semibold text-neutral-900 mb-1">Settings</h4>
                <p className="text-sm text-neutral-600">Configure your site</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-12">
          <h3 className="text-xl font-bold text-[#2D5A27] mb-6">Dashboard Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <p className="text-sm text-neutral-600 mb-2">Total Posts</p>
              <p className="text-4xl font-bold text-[#2D5A27]">{stats.totalPosts}</p>
              <p className="text-xs text-neutral-500 mt-2">All-time published</p>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <p className="text-sm text-neutral-600 mb-2">Total Views</p>
              <p className="text-4xl font-bold text-[#3D7A37]">{stats.totalViews.toLocaleString()}</p>
              <p className="text-xs text-neutral-500 mt-2">Across all content</p>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <p className="text-sm text-neutral-600 mb-2">Recent Posts</p>
              <p className="text-4xl font-bold text-[#E2725B]">{recentPosts.length}</p>
              <p className="text-xs text-neutral-500 mt-2">Last 5 articles</p>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mb-12">
          <h3 className="text-xl font-bold text-[#2D5A27] mb-6">Recent Activity</h3>
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            {recentPosts.length === 0 ? (
              <div className="px-6 py-12 text-center text-neutral-500">
                <p className="mb-4">No posts yet. Start by creating your first article!</p>
                <Link href="/admin/new-post" className="inline-block px-6 py-2 bg-gradient-to-r from-[#2D5A27] to-[#3D7A37] text-white rounded-lg hover:shadow-lg transition">
                  Create First Post
                </Link>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 text-left text-sm text-neutral-600 font-medium">
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Views</th>
                    <th className="px-6 py-4">Published</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPosts.map((post) => (
                    <tr key={post.id} className="border-t border-neutral-100 hover:bg-neutral-50 transition">
                      <td className="px-6 py-4 font-medium text-neutral-900">
                        <Link href={`/admin/posts/${post.id}`} className="hover:text-[#2D5A27]">
                          {post.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          post.status === "published" 
                            ? "bg-green-100 text-green-700"
                            : post.status === "draft"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-neutral-100 text-neutral-700"
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-neutral-600">{post.viewCount ?? 0}</td>
                      <td className="px-6 py-4 text-neutral-600 text-sm">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Security Tip */}
        <section className="p-6 bg-gradient-to-r from-[#2D5A27]/5 to-[#3D7A37]/5 border border-[#2D5A27]/10 rounded-xl">
          <h4 className="font-semibold text-[#2D5A27] mb-2">🔐 Security Tip</h4>
          <p className="text-sm text-neutral-700">
            Keep your admin credentials secure. Never share your password. If you notice any unusual activity, 
            change your password immediately.
          </p>
        </section>
      </main>
    </div>
  );
}
