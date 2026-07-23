import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getPublishedBlogPosts } from "@/lib/blog-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blogs | KRM Healthcare",
  description:
    "Read the latest insights from KRM Healthcare on laboratory diagnostics, equipment, and industry updates.",
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export default async function BlogsPage() {
  const blogs = await getPublishedBlogPosts();

  return (
    <main className="blogs-page">
      <Header />

      <section className="blogs-hero" aria-labelledby="blogs-title">
        <h1 id="blogs-title">Blogs</h1>
        <p>
          Insights, product updates, and laboratory best practices from the KRM
          Healthcare team.
        </p>
      </section>

      <section className="blogs-list" aria-label="Published blog posts">
        {blogs.length === 0 ? (
          <p className="blogs-empty">
            No published blogs yet. Check back soon.
          </p>
        ) : (
          <div className="blogs-grid">
            {blogs.map((blog) => (
              <article className="blog-card" key={blog.id}>
                <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
                <h2>
                  <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                </h2>
                {blog.excerpt ? <p>{blog.excerpt}</p> : null}
                <Link className="blog-card__link" href={`/blogs/${blog.slug}`}>
                  Read more <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
