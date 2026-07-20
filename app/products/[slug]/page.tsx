import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FAQOptions from "@/components/FAQOptions";
import Header from "@/components/Header";
import applicationImage from "@/public/application.png";
import analyzerImage from "@/public/image.png";
import faqsImage from "@/public/faqs.png";

const products = {
  "3-part-hematology-analyzer": {
    title: "3-Part Hematology Analyzer",
    summary:
      "Reliable hematology solution designed for routine blood analysis, delivering accurate and consistent Complete Blood Count (CBC) testing for pathology laboratories and diagnostic centres.",
  },
};

type ProductSlug = keyof typeof products;
type ProductPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(products).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products[slug as ProductSlug];

  return product
    ? {
        title: `${product.title} | KRM Healthcare`,
        description: product.summary,
      }
    : { title: "Product Not Found | KRM Healthcare" };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products[slug as ProductSlug];

  if (!product) notFound();

  return (
    <main className="product-details-page">
      <Header />

      <section className="product-details-hero" aria-labelledby="product-title">
        <Image
          className="product-details-hero__image"
          src={analyzerImage}
          alt="3-part hematology analyzer"
          priority
          sizes="100vw"
        />
        <div className="product-details-hero__wash" aria-hidden="true" />
        <div className="product-details-hero__content">
          <h1 id="product-title">{product.title}</h1>
          <p>{product.summary}</p>
        </div>
      </section>

      <section
        className="product-description"
        aria-labelledby="product-description-title"
      >
        <h2 id="product-description-title">Product Description</h2>

        <div className="product-description__card">
          <p>
            The 3-Part Hematology Analyzer is designed to support routine
            hematology testing by providing reliable and consistent blood
            analysis. Built for everyday laboratory operations, it helps
            healthcare professionals perform Complete Blood Count (CBC) tests
            efficiently while maintaining dependable diagnostic performance.
            <br />
            Suitable for small to medium diagnostic laboratories, the analyzer
            combines ease of operation with reliable workflow support, making it
            an ideal solution for routine blood testing requirements.
          </p>

          <div className="product-description__icon" aria-hidden="true">
            <svg viewBox="0 0 100 100" role="presentation">
              <path d="M50 20C42 32 31 44 31 58a19 19 0 0 0 38 0c0-14-11-26-19-38Z" />
              <path d="M22 27c-8 1-15 6-18 13 8 2 16 0 21-6 2-3 4-7 5-10-3 1-6 2-8 3Zm56 0c8 1 15 6 18 13-8 2-16 0-21-6-2-3-4-7-5-10 3 1 6 2 8 3Z" />
              <path
                className="product-description__cross"
                d="M46 46h8v8h8v8h-8v8h-8v-8h-8v-8h8Z"
              />
            </svg>
          </div>
        </div>
      </section>

      <section className="product-highlights" aria-labelledby="features-title">
        <h2 id="features-title">Key Features</h2>

        <div className="product-features">
          <div>Accurate Blood Analysis</div>
          <div>Consistent Performance</div>
          <div>Efficient Workflow</div>
        </div>

        <h2>Product Benefits</h2>
        <ul className="product-benefits">
          <li>Supports routine CBC testing</li>
          <li>Delivers reliable laboratory performance</li>
          <li>Simplifies everyday diagnostic workflows</li>
          <li>Helps maintain consistent reporting</li>
        </ul>
      </section>

      <section
        className="product-applications"
        aria-labelledby="applications-title"
      >
        <h2 id="applications-title">Applications</h2>

        <article className="application-card">
          <Image
            className="application-card__icon"
            src={applicationImage}
            alt="Microscope and laboratory test tube"
            sizes="144px"
          />
          <h3>Pathology Laboratories</h3>
        </article>

        <div className="application-dots" aria-label="Application 2 of 4">
          <span />
          <span className="application-dots__active" />
          <span />
          <span />
        </div>
      </section>

      <section
        className="product-specifications"
        aria-labelledby="specifications-title"
      >
        <h2 id="specifications-title">Product Specifications</h2>

        <div className="specification-table">
          <div className="specification-column">
            <h3>Specification</h3>
            <div>Product Category</div>
            <div>Product Type</div>
            <div>Test Type</div>
            <div>Application</div>
            <div>Reagent Compatibility</div>
          </div>

          <div className="specification-column specification-column--details">
            <h3>Details</h3>
            <div>Hematology</div>
            <div>3-Part Hematology Analyzer</div>
            <div>Complete Blood Count (CBC)</div>
            <div>Routine Blood Analysis</div>
            <div>Hematology Reagents</div>
          </div>
        </div>

        <h2 className="downloads-title">Downloads</h2>
        <div className="product-downloads">
          {[
            "Product Brochure",
            "Technical Datasheet",
            "Reagent Information Sheet",
            "User Manual",
          ].map((download) => (
            <Link href="/contact" key={download}>
              <span className="download-icon" aria-hidden="true">
                <svg viewBox="0 0 32 38" role="presentation">
                  <path d="M5 1h15l7 7v29H5zM20 1v8h7M10 19h12M10 24h12M10 29h8" />
                </svg>
              </span>
              {download}
            </Link>
          ))}
        </div>
      </section>

      <section className="product-faqs" aria-labelledby="product-faqs-title">
        <h2 id="product-faqs-title">FAQs</h2>

        <div className="product-faqs__content">
          <Image
            className="product-faqs__image"
            src={faqsImage}
            alt="Laboratory equipment and scientific glassware"
            sizes="(max-width: 600px) 36vw, 225px"
          />
          <FAQOptions
            className="product-faqs__items"
            options={[
              "Which laboratories is this product suitable for?",
              "What products are available under this category?",
              "Can I download the product brochure?",
              "How can I request more product information?",
              "What diagnostic applications is this product designed for?",
            ]}
          />
        </div>

        <Link className="product-quote" href="/contact">
          Get a Quote
        </Link>
      </section>
    </main>
  );
}
