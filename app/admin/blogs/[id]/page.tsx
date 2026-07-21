import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { removeBlog, saveBlog } from "@/app/admin/blog-actions";
import BlogEditorForm from "@/app/admin/components/BlogEditorForm";
import { getBlogPostById } from "@/lib/blog-store";
import { requireAdminPage } from "@/lib/require-admin";

export const metadata: Metadata = {
  title: "Edit Blog | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type EditBlogPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  await requireAdminPage();
  const { id } = await params;
  const blog = await getBlogPostById(id);

  if (!blog) {
    notFound();
  }

  return (
    <section className="admin-section">
      <header className="admin-section__header">
        <div>
          <Link className="admin-service-form__back" href="/admin/blogs">
            Back to Blogs
          </Link>
          <p className="admin-section__eyebrow">Admin</p>
          <h1>Edit Blog</h1>
          <p className="admin-section__description">
            Update blog content, excerpt, and publish status.
          </p>
        </div>
        <form action={removeBlog}>
          <input type="hidden" name="id" value={blog.id} />
          <button className="admin-button admin-button--danger" type="submit">
            Delete Blog
          </button>
        </form>
      </header>

      <div className="admin-blog-layout">
        <BlogEditorForm action={saveBlog} initialBlog={blog} />
        <article className="admin-blog-preview">
          <p className="admin-service-preview__eyebrow">Preview</p>
          <h2>{blog.title}</h2>
          {blog.excerpt ? <p className="admin-blog-preview__excerpt">{blog.excerpt}</p> : null}
          <div
            className="admin-blog-preview__content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>
      </div>
    </section>
  );
}
