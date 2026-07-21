import type { Metadata } from "next";
import Link from "next/link";
import { removeBlog } from "@/app/admin/blog-actions";
import { getBlogPosts } from "@/lib/blog-store";
import { requireAdminPage } from "@/lib/require-admin";

export const metadata: Metadata = {
  title: "Blogs | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminBlogsPage() {
  await requireAdminPage();
  const blogs = await getBlogPosts();

  return (
    <section className="admin-section">
      <header className="admin-section__header">
        <div>
          <p className="admin-section__eyebrow">Admin</p>
          <h1>Blogs</h1>
          <p className="admin-section__description">
            Create and manage blog posts with a rich text editor. Saved to
            MongoDB.
          </p>
        </div>
        <Link className="admin-button" href="/admin/blogs/new">
          Create Blog
        </Link>
      </header>

      <article className="admin-card admin-card--wide">
        {blogs.length === 0 ? (
          <p className="admin-empty">
            No blogs yet. <Link href="/admin/blogs/new">Create your first blog</Link>
          </p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Title</th>
                  <th>Excerpt</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>
                      <span
                        className={`admin-badge admin-badge--${blog.status === "published" ? "new" : "read"}`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td>{blog.title}</td>
                    <td>{blog.excerpt || "—"}</td>
                    <td>{formatDate(blog.updatedAt)}</td>
                    <td className="admin-table__actions">
                      <Link className="admin-button" href={`/admin/blogs/${blog.id}`}>
                        Edit
                      </Link>
                      <form action={removeBlog}>
                        <input type="hidden" name="id" value={blog.id} />
                        <button
                          className="admin-button admin-button--danger"
                          type="submit"
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
