import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryLandingView from "@/components/CategoryLandingView";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import {
  getServiceCategoryBySlug,
  getServicesByCategoryId,
} from "@/lib/admin-store";
import { resolveCategoryLanding } from "@/lib/category-landing-resolve";

export const dynamic = "force-dynamic";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getServiceCategoryBySlug(slug);
  const landing = resolveCategoryLanding(category, slug);

  if (!landing && !category) {
    return { title: "Category | KRM Healthcare" };
  }

  return {
    title: `${landing?.title ?? category?.name} | KRM Healthcare`,
    description: landing?.tagline ?? category?.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getServiceCategoryBySlug(slug);
  const landing = resolveCategoryLanding(category, slug);

  if (!category && !landing) {
    notFound();
  }

  const services = category
    ? await getServicesByCategoryId(category.id)
    : [];

  if (!landing) {
    return (
      <main className="category-page">
        <SiteHeader />
        <article className="category-landing">
          <header className="category-landing__hero">
            <h1>{category?.name}</h1>
            {category?.description ? <p>{category.description}</p> : null}
          </header>
          {services.length > 0 ? (
            <div className="category-landing__body">
              <section className="category-landing__services">
                <h2 className="category-landing__heading">Featured Products</h2>
                <div className="category-landing__service-links">
                  {services.map((service) => (
                    <a key={service.id} href={`/products/${service.slug}`}>
                      <strong>{service.title}</strong>
                      <span>{service.tagline || service.summary}</span>
                    </a>
                  ))}
                </div>
              </section>
            </div>
          ) : null}
        </article>
        <Footer />
      </main>
    );
  }

  return (
    <main className="category-page">
      <SiteHeader />
      <CategoryLandingView
        categoryName={category?.name ?? landing.title}
        landing={landing}
        services={services}
        heroImageUrl={category?.heroImageUrl}
      />
      <Footer />
    </main>
  );
}
