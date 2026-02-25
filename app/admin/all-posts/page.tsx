import { getAllPosts } from "@/lib/queries";
import { DeletePostButton } from "../DeletePostButton";

export default async function AllPostsPage() {
  const posts = await getAllPosts();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-primary-700 mb-8">All Posts</h1>

      <div className="bg-white rounded-xl shadow-organic border border-primary-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary-50 text-left text-sm text-primary-600">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Views</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-primary-500">
                    No posts yet. Create your first post from New Post.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="border-t border-primary-100 hover:bg-primary-50/50">
                    <td className="px-4 py-3 font-medium text-primary-700">{post.title}</td>
                    <td className="px-4 py-3 text-primary-600">{post.categoryName ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === "published"
                            ? "bg-primary-100 text-primary-700"
                            : "bg-neutral-200 text-neutral-600"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-primary-600">{post.viewCount ?? 0}</td>
                    <td className="px-4 py-3 text-primary-600">
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <DeletePostButton postId={post.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
