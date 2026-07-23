import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import {
  getBlogPostBySlug,
  getPublishedBlogPosts,
} from "@/lib/blog-store";

export const dynamic = "force-dynamic";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogPostBySlug(slug);

  if (!blog || blog.status !== "published") {
    return {
      title: "Blog | KRM Healthcare",
    };
  }

  return {
    title: `${blog.title} | KRM Healthcare`,
    description: blog.excerpt || blog.title,
  };
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
  }).format(new Date(value));
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = await getBlogPostBySlug(slug);

  if (!blog || blog.status !== "published") {
    notFound();
  }

  const related = (await getPublishedBlogPosts())
    .filter((item) => item.id !== blog.id)
    .slice(0, 3);

  return (
    <main className="blog-detail-page">
      <SiteHeader />

      <article className="blog-detail">
        <Link className="blog-detail__back" href="/blogs">
          ← Back to Blogs
        </Link>

        <header className="blog-detail__header">
          <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
          <h1>{blog.title}</h1>
          {blog.excerpt ? <p className="blog-detail__excerpt">{blog.excerpt}</p> : null}
        </header>

        <div
          className="blog-detail__content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>

      {related.length > 0 ? (
        <section className="blog-related" aria-labelledby="related-blogs-title">
          <h2 id="related-blogs-title">More from KRM</h2>
          <div className="blogs-grid">
            {related.map((item) => (
              <article className="blog-card" key={item.id}>
                <h2>
                  <Link href={`/blogs/${item.slug}`}>{item.title}</Link>
                </h2>
                {item.excerpt ? <p>{item.excerpt}</p> : null}
                <Link className="blog-card__link" href={`/blogs/${item.slug}`}>
                  Read more <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <Footer />
    </main>
  );
}
