import Image from "next/image";
import Link from "next/link";
import FAQOptions from "@/components/FAQOptions";
import ProductApplications from "@/components/ProductApplications";
import ProductBenefits from "@/components/ProductBenefits";
import ProductSpecifications from "@/components/ProductSpecifications";
import type { Service } from "@/lib/admin-store";
import { contactFormLink } from "@/lib/contact-links";
import analyzerImage from "@/public/image.png";
import faqsImage from "@/public/faqs.png";

type ProductServiceDetailProps = {
  service: Service;
};

export default function ProductServiceDetail({
  service,
}: ProductServiceDetailProps) {
  const productPath = `/products/${service.slug}`;
  const overviewParagraphs = service.overview
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const featureTitles = service.featureSections
    .map((section) => section.title.trim())
    .filter(Boolean);
  const benefitItems = service.featureSections.flatMap((section) =>
    section.items.map((item) => item.trim()).filter(Boolean),
  );
  const keyFeatures =
    featureTitles.length > 0 ? featureTitles : benefitItems.slice(0, 3);
  const listedBenefits =
    featureTitles.length > 0
      ? benefitItems.slice(0, 5)
      : benefitItems.slice(3, 8);

  return (
    <>
      <section className="product-details-hero" aria-labelledby="product-title">
        {service.heroImageUrl ? (
          <Image
            className="product-details-hero__image"
            src={service.heroImageUrl}
            alt={service.title}
            width={960}
            height={640}
            priority
            sizes="100vw"
          />
        ) : (
          <Image
            className="product-details-hero__image"
            src={analyzerImage}
            alt={service.title}
            priority
            sizes="100vw"
          />
        )}
        <div className="product-details-hero__wash" aria-hidden="true" />
        <div className="product-details-hero__content">
          <h1 id="product-title">{service.title}</h1>
          <p>{service.tagline || service.summary}</p>
        </div>
      </section>

      {(overviewParagraphs.length > 0 || service.advantageContent) && (
        <section
          className="product-description"
          aria-labelledby="product-description-title"
        >
          <h2 id="product-description-title">Product Description</h2>

          <div className="product-description__card">
            <p>
              {overviewParagraphs.map((paragraph, index) => (
                <span key={`overview-${index}`}>
                  {index > 0 ? (
                    <>
                      <br />
                      <br />
                    </>
                  ) : null}
                  {paragraph}
                </span>
              ))}
              {service.advantageContent ? (
                <>
                  {overviewParagraphs.length > 0 ? (
                    <>
                      <br />
                      <br />
                    </>
                  ) : null}
                  <strong>
                    {service.advantageTitle || "The KRM Healthcare Advantage"}
                  </strong>
                  <br />
                  {service.advantageContent}
                </>
              ) : null}
              {service.closingDescription ? (
                <>
                  <br />
                  <br />
                  {service.closingTitle ? (
                    <>
                      <strong>{service.closingTitle}</strong>
                      <br />
                    </>
                  ) : null}
                  {service.closingDescription}
                </>
              ) : null}
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
      )}

      {(keyFeatures.length > 0 || listedBenefits.length > 0) && (
        <section
          className="product-highlights"
          aria-labelledby="features-title"
        >
          {keyFeatures.length > 0 ? (
            <>
              <h2 id="features-title">Key Features</h2>
              <div className="product-features">
                {keyFeatures.map((title, index) => (
                  <div key={`feature-${index}`}>{title}</div>
                ))}
              </div>
            </>
          ) : null}

          {listedBenefits.length > 0 ? (
            <>
              <h2>Product Benefits</h2>
              <ProductBenefits benefits={listedBenefits} />
            </>
          ) : null}
        </section>
      )}

      {service.applications.length > 0 ? (
        <ProductApplications applications={service.applications} />
      ) : null}

      {service.specifications.length > 0 || service.downloads.length > 0 ? (
        <section
          className="product-specifications"
          aria-labelledby={
            service.specifications.length > 0
              ? "specifications-title"
              : "downloads-title"
          }
        >
          {service.specifications.length > 0 ? (
            <>
              <h2 id="specifications-title">Product Specifications</h2>
              <ProductSpecifications specifications={service.specifications} />
            </>
          ) : null}

          {service.downloads.length > 0 ? (
            <>
              <h2 id="downloads-title" className="downloads-title">
                Downloads
              </h2>
              <div className="product-downloads">
                {service.downloads.map((download) => (
                  <a
                    href={download.fileUrl}
                    key={download.id}
                    download
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="download-icon" aria-hidden="true">
                      <svg viewBox="0 0 32 38" role="presentation">
                        <path d="M5 1h15l7 7v29H5zM20 1v8h7M10 19h12M10 24h12M10 29h8" />
                      </svg>
                    </span>
                    {download.title}
                  </a>
                ))}
              </div>
            </>
          ) : null}
        </section>
      ) : null}

      {service.faqs.length > 0 ? (
        <section className="product-faqs" aria-labelledby="product-faqs-title">
          <h2 id="product-faqs-title">FAQs</h2>

          <div className="product-faqs__content">
            {service.faqsImageUrl ? (
              <Image
                className="product-faqs__image"
                src={service.faqsImageUrl}
                alt=""
                width={315}
                height={315}
                sizes="(max-width: 600px) 36vw, 225px"
              />
            ) : (
              <Image
                className="product-faqs__image"
                src={faqsImage}
                alt="Laboratory equipment and scientific glassware"
                sizes="(max-width: 600px) 36vw, 225px"
              />
            )}
            <FAQOptions
              className="product-faqs__items"
              items={service.faqs.map((faq) => ({
                question: faq.question,
                answer: faq.answer,
              }))}
            />
          </div>

          <Link
            className="product-quote"
            href={contactFormLink({
              requirement: "Product Quote",
              sourcePage: service.title,
              sourcePath: productPath,
              formName: "Quote Request",
            })}
          >
            Get a Quote
          </Link>
        </section>
      ) : (
        <section className="product-faqs" aria-label="Get a quote">
          <Link
            className="product-quote"
            href={contactFormLink({
              requirement: "Product Quote",
              sourcePage: service.title,
              sourcePath: productPath,
              formName: "Quote Request",
            })}
          >
            Get a Quote
          </Link>
        </section>
      )}
    </>
  );
}
