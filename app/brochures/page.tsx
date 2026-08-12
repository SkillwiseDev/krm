import type { Metadata } from "next";
import BrochureDownloadsList from "@/components/BrochureDownloadsList";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { getProductBrochures } from "@/lib/product-brochures-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Product Brochures | KRM Healthcare",
  description:
    "Download product brochures for KRM Healthcare laboratory analyzers and reagents.",
};

export default async function BrochuresPage() {
  const data = await getProductBrochures();

  return (
    <main className="brochures-page">
      <SiteHeader />

      <section
        className="brochures-page__hero"
        aria-labelledby="brochures-page-title"
      >
        <h1 id="brochures-page-title">{data.title}</h1>
        <p>
          Browse and download product brochures for KRM Healthcare instruments
          and laboratory solutions.
        </p>
      </section>

      <section className="brochures-page__list" aria-label="Product brochures">
        {data.items.length === 0 ? (
          <p className="brochures-page__empty">
            No brochures available yet. Check back soon.
          </p>
        ) : (
          <BrochureDownloadsList items={data.items} />
        )}
      </section>

      <Footer />
    </main>
  );
}
