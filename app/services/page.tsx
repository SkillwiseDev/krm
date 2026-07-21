import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FAQOptions from "@/components/FAQOptions";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { contactFormLink } from "@/lib/contact-links";
import faqsImage from "@/public/faqs.png";
import productImage from "@/public/image.png";
import laboratoryServiceImage from "@/public/image6.png";
import serviceImage from "@/public/service.png";

export const metadata: Metadata = {
  title: "Services | KRM Healthcare",
  description:
    "Explore KRM Healthcare's complete portfolio of diagnostic laboratory solutions.",
};

export default function ServicesPage() {
  return (
    <main className="services-page">
      <Header />

      <section aria-labelledby="services-intro-title">
        <div className="services-page__media">
          <Image
            className="services-page__image"
            src={serviceImage}
            alt="KRM Healthcare diagnostic laboratory workspace"
            priority
            sizes="100vw"
          />
          <div className="services-page__wash" aria-hidden="true" />
        </div>

        <div className="services-page__intro">
          <h1 id="services-intro-title" className="sr-only">
            Complete laboratory solutions
          </h1>
          <p>
            Explore a complete portfolio of laboratory solutions developed to
            support every stage of diagnostic testing. From routine blood
            analysis to rapid diagnostics and laboratory setup, every solution
            is designed to improve workflow efficiency and testing reliability.
          </p>
        </div>
      </section>

      <section
        className="product-portfolio"
        aria-labelledby="product-portfolio-title"
      >
        <h2 id="product-portfolio-title">Product Portfolio</h2>

        <div className="product-portfolio__image-wrap">
          <Image
            className="product-portfolio__image"
            src={productImage}
            alt="AC310 3-part hematology analyzer"
            sizes="(max-width: 600px) 52vw, 280px"
          />
        </div>

        <article className="portfolio-card">
          <h3>3-Part Hematology Analyzer</h3>
          <Link
            className="portfolio-card__link"
            href="/products/3-part-hematology-analyzer"
          >
            Learn More <span aria-hidden="true">→</span>
          </Link>
        </article>

        <div className="portfolio-dots" aria-label="Product 2 of 4">
          <span />
          <span className="portfolio-dots__active" />
          <span />
          <span />
        </div>
      </section>

      <section
        className="service-portfolio"
        aria-labelledby="service-portfolio-title"
      >
        <h2 id="service-portfolio-title">Service portfolio</h2>

        <Image
          className="service-portfolio__image"
          src={laboratoryServiceImage}
          alt="Laboratory professional examining a sample under a microscope"
          sizes="(max-width: 700px) calc(100vw - 48px), 765px"
        />

        <h3>Turnkey Laboratory Solutions</h3>
        <Link
          className="service-portfolio__link"
          href={contactFormLink({
            requirement: "Turnkey Laboratory Solutions",
            sourcePage: "Services",
            sourcePath: "/services",
          })}
        >
          Learn More <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section
        className="technical-resources"
        aria-labelledby="technical-resources-title"
      >
        <h2 id="technical-resources-title">Technical Resources</h2>

        <div className="technical-resources__links">
          <Link
            href={contactFormLink({
              requirement: "Product Brochure",
              sourcePage: "Services",
              sourcePath: "/services",
            })}
          >
            Product Brochure
          </Link>
          <Link
            href={contactFormLink({
              requirement: "Reagent Sheet",
              sourcePage: "Services",
              sourcePath: "/services",
            })}
          >
            Reagent Sheet
          </Link>
          <Link
            href={contactFormLink({
              requirement: "Technical Specifications",
              sourcePage: "Services",
              sourcePath: "/services",
            })}
          >
            Technical Specifications
          </Link>
        </div>

        <h3>FAQs</h3>

        <div className="faqs-panel">
          <Image
            className="faqs-panel__image"
            src={faqsImage}
            alt="Laboratory equipment and scientific glassware"
            sizes="(max-width: 600px) 34vw, 315px"
          />

          <FAQOptions />
        </div>

        <Link
          className="demo-request"
          href={contactFormLink({
            requirement: "Product Demo Request",
            sourcePage: "Services",
            sourcePath: "/services",
            formName: "Demo Request",
          })}
        >
          Request Product Demo
        </Link>
      </section>

      <Footer />
    </main>
  );
}
