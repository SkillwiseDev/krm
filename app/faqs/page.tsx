import type { Metadata } from "next";
import Footer from "@/components/Footer";
import SiteFaqsList from "@/components/SiteFaqsList";
import SiteHeader from "@/components/SiteHeader";
import { siteFaqSections } from "@/lib/site-faqs";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | KRM Healthcare",
  description:
    "Answers to common questions about KRM Healthcare products, analyzers, reagents, ordering, quality standards, and technical support.",
};

export default function FaqsPage() {
  return (
    <main className="faqs-page">
      <SiteHeader />

      <section className="faqs-page__hero" aria-labelledby="faqs-title">
        <h1 id="faqs-title">Frequently Asked Questions (FAQs)</h1>
        <p>
          Clear answers on procurement, analyzers, reagents, quality, and
          support from the KRM Healthcare team.
        </p>
      </section>

      <div className="faqs-page__content">
        <SiteFaqsList sections={siteFaqSections} />
      </div>

      <Footer />
    </main>
  );
}
