import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import certificate from "@/public/certificate.png";
import { getSiteCertifications } from "@/lib/site-certifications-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trust & Certifications | KRM Healthcare",
  description:
    "View KRM Healthcare quality certifications, including ISO and CE standards.",
};

export default async function CertificationsPage() {
  const data = await getSiteCertifications();

  return (
    <main className="certifications-page">
      <SiteHeader />

      <section
        className="certifications-page__hero"
        aria-labelledby="certifications-page-title"
      >
        <h1 id="certifications-page-title">{data.title}</h1>
        <p>
          Quality certifications that reflect our commitment to international
          manufacturing and laboratory standards.
        </p>
      </section>

      <section
        className="certifications-page__list"
        aria-label="Uploaded certifications"
      >
        {data.items.length === 0 ? (
          <p className="certifications-page__empty">
            No certifications available yet. Check back soon.
          </p>
        ) : (
          <ul className="certifications-page__grid">
            {data.items.map((item) => {
              const content = (
                <>
                  <div className="certifications-page__media">
                    {item.imageUrl ? (
                      <Image
                        className="certifications-page__image"
                        src={item.imageUrl}
                        alt={item.cardTitle}
                        width={420}
                        height={500}
                        sizes="(max-width: 700px) 80vw, 320px"
                      />
                    ) : (
                      <Image
                        className="certifications-page__image"
                        src={certificate}
                        alt={item.cardTitle}
                        sizes="(max-width: 700px) 80vw, 320px"
                      />
                    )}
                  </div>
                  <div className="certifications-page__body">
                    <h2>{item.cardTitle}</h2>
                    {item.cardDescription ? <p>{item.cardDescription}</p> : null}
                    {item.fileUrl ? (
                      <span className="certifications-page__cta">
                        Download PDF <span aria-hidden="true">→</span>
                      </span>
                    ) : null}
                  </div>
                </>
              );

              return (
                <li key={item.id}>
                  {item.fileUrl ? (
                    <a
                      className="certifications-page__card"
                      href={item.fileUrl}
                      download
                      aria-label={`Download ${item.cardTitle}`}
                    >
                      {content}
                    </a>
                  ) : (
                    <article className="certifications-page__card">
                      {content}
                    </article>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Footer />
    </main>
  );
}
