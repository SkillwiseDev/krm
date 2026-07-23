import Image from "next/image";
import Link from "next/link";
import type {
  CategoryCta,
  CategoryLanding,
  CategoryLandingSection,
} from "@/lib/category-landing";
import type { Service } from "@/lib/admin-store";
import { contactFormLink } from "@/lib/contact-links";

type CategoryLandingViewProps = {
  categoryName: string;
  landing: CategoryLanding;
  services: Service[];
  heroImageUrl?: string;
};

function CtaLink({
  cta,
  sourcePath,
}: {
  cta: CategoryCta;
  sourcePath: string;
}) {
  return (
    <Link
      className="category-landing__cta"
      href={contactFormLink({
        requirement: cta.requirement,
        sourcePage: "Category",
        sourcePath,
        formName: cta.formName ?? "Category Enquiry",
      })}
    >
      {cta.label}
    </Link>
  );
}

function SectionBlock({
  section,
  sourcePath,
}: {
  section: CategoryLandingSection;
  sourcePath: string;
}) {
  switch (section.type) {
    case "intro":
    case "paragraphs":
      return (
        <div className="category-landing__copy">
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
      );
    case "heading":
      return <h2 className="category-landing__heading">{section.text}</h2>;
    case "subheading":
      return <h3 className="category-landing__subheading">{section.text}</h3>;
    case "bullets":
      return (
        <ul className="category-landing__bullets">
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "advantages":
      return (
        <div className="category-landing__advantages">
          <h2 className="category-landing__heading">{section.title}</h2>
          <div className="category-landing__advantage-grid">
            {section.items.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      );
    case "productGrid":
      return (
        <div className="category-landing__product-grid">
          {section.products.map((product) => (
            <article key={product.title} className="category-landing__product">
              {product.badge ? (
                <span className="category-landing__badge">{product.badge}</span>
              ) : null}
              <h3>
                {product.href ? (
                  <Link href={product.href}>{product.title}</Link>
                ) : (
                  product.title
                )}
              </h3>
              {product.idealFor ? (
                <p className="category-landing__ideal">
                  <strong>Ideal for:</strong> {product.idealFor}
                </p>
              ) : null}
              <ul>
                {product.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              {product.cta ? (
                <CtaLink cta={product.cta} sourcePath={sourcePath} />
              ) : null}
            </article>
          ))}
        </div>
      );
    case "table":
      return (
        <div className="category-landing__table-wrap">
          {section.title ? (
            <h3 className="category-landing__subheading">{section.title}</h3>
          ) : null}
          <table className="category-landing__table">
            <thead>
              <tr>
                {section.headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row) => (
                <tr key={row.join("|")}>
                  {row.map((cell, index) => (
                    <td key={`${row[0]}-${index}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "cta":
      return (
        <div className="category-landing__cta-row">
          <CtaLink cta={section.cta} sourcePath={sourcePath} />
        </div>
      );
    case "closing":
      return (
        <div className="category-landing__closing">
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
          {section.cta ? (
            <CtaLink cta={section.cta} sourcePath={sourcePath} />
          ) : null}
        </div>
      );
    default:
      return null;
  }
}

export default function CategoryLandingView({
  categoryName,
  landing,
  services,
  heroImageUrl,
}: CategoryLandingViewProps) {
  const sourcePath = `/categories/${landing.slug}`;

  return (
    <article className="category-landing">
      <header
        className={`category-landing__hero${
          heroImageUrl ? " category-landing__hero--image" : ""
        }`}
      >
        {heroImageUrl ? (
          <>
            <Image
              className="category-landing__hero-image"
              src={heroImageUrl}
              alt={landing.title}
              fill
              priority
              sizes="100vw"
            />
            <div className="category-landing__hero-wash" aria-hidden="true" />
          </>
        ) : null}
        <div className="category-landing__hero-content">
          <p className="category-landing__eyebrow">{categoryName}</p>
          <h1>{landing.title}</h1>
          <p className="category-landing__tagline">{landing.tagline}</p>
        </div>
      </header>

      <div className="category-landing__body">
        {landing.sections.map((section, index) => (
          <SectionBlock
            key={`${section.type}-${index}`}
            section={section}
            sourcePath={sourcePath}
          />
        ))}

        {services.length > 0 ? (
          <section className="category-landing__services">
            <h2 className="category-landing__heading">Featured Products</h2>
            <div className="category-landing__service-links">
              {services.map((service) => (
                <Link key={service.id} href={`/products/${service.slug}`}>
                  <strong>{service.title}</strong>
                  <span>{service.tagline || service.summary}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
