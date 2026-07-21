import type { Metadata } from "next";
import Link from "next/link";
import { saveBlog } from "@/app/admin/blog-actions";
import BlogEditorForm from "@/app/admin/components/BlogEditorForm";
import { requireAdminPage } from "@/lib/require-admin";

export const metadata: Metadata = {
  title: "Create Blog | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewBlogPage() {
  await requireAdminPage();

  return (
    <section className="admin-section">
      <header className="admin-section__header">
        <div>
          <Link className="admin-service-form__back" href="/admin/blogs">
            Back to Blogs
          </Link>
          <p className="admin-section__eyebrow">Admin</p>
          <h1>Create Blog</h1>
          <p className="admin-section__description">
            Write a new blog post using the rich text editor.
          </p>
        </div>
      </header>

      <BlogEditorForm action={saveBlog} />
    </section>
  );
}
