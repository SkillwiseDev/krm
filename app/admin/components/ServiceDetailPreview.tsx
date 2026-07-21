import type { Service } from "@/lib/admin-store";
import Image from "next/image";

type ServiceDetailPreviewProps = {
  service: Pick<
    Service,
    | "title"
    | "tagline"
    | "heroImageUrl"
    | "overview"
    | "featureSections"
    | "specifications"
    | "advantageTitle"
    | "advantageContent"
    | "closingTitle"
    | "closingDescription"
  >;
};

export default function ServiceDetailPreview({ service }: ServiceDetailPreviewProps) {
  const overviewParagraphs = service.overview
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <article className="admin-service-preview">
      <header className="admin-service-preview__hero">
        <p className="admin-service-preview__eyebrow">Service Preview</p>
        {service.heroImageUrl ? (
          <div className="admin-service-preview__hero-image">
            <Image
              src={service.heroImageUrl}
              alt={service.title || "Service hero image"}
              width={960}
              height={420}
            />
          </div>
        ) : null}
        <h2>{service.title || "Service title"}</h2>
        <p className="admin-service-preview__tagline">
          {service.tagline || "Tagline will appear here"}
        </p>
        <div className="admin-service-preview__actions">
          <span>Request a Live Demo</span>
          <span>Get a Quote</span>
        </div>
      </header>

      <section>
        <h3>Product Overview</h3>
        {overviewParagraphs.length > 0 ? (
          overviewParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
        ) : (
          <p className="admin-empty">Overview content not added yet.</p>
        )}
      </section>

      <section>
        <h3>Key Features & Business Benefits</h3>
        {service.featureSections.length > 0 ? (
          service.featureSections.map((section) => (
            <div className="admin-service-preview__feature" key={section.title}>
              <h4>{section.title}</h4>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="admin-empty">No feature sections added yet.</p>
        )}
      </section>

      <section>
        <h3>Technical Specifications</h3>
        {service.specifications.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table admin-service-preview__specs">
              <thead>
                <tr>
                  <th>Feature / Specification</th>
                  <th>Product Detail</th>
                </tr>
              </thead>
              <tbody>
                {service.specifications.map((row) => (
                  <tr key={`${row.label}-${row.detail}`}>
                    <td>{row.label}</td>
                    <td>
                      {row.detail.split("\n").map((line) => (
                        <span className="admin-service-preview__spec-line" key={line}>
                          {line}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="admin-empty">No specifications added yet.</p>
        )}
      </section>

      <section>
        <h3>{service.advantageTitle || "The KRM Healthcare Advantage"}</h3>
        <p>{service.advantageContent || "Advantage content not added yet."}</p>
      </section>

      <section className="admin-service-preview__closing">
        <h3>{service.closingTitle || "Closing title"}</h3>
        <p>{service.closingDescription || "Closing description not added yet."}</p>
        <div className="admin-service-preview__actions">
          <span>Contact Customer Care</span>
          <span>Download Technical Brochure</span>
        </div>
      </section>
    </article>
  );
}
