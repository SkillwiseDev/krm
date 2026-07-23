import type { Metadata } from "next";
import CertificationsForm from "@/app/admin/components/CertificationsForm";
import { getSiteCertifications } from "@/lib/site-certifications-store";
import { requireAdminPage } from "@/lib/require-admin";

export const metadata: Metadata = {
  title: "Trust & Certifications | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminCertificationsPage() {
  await requireAdminPage();
  const certifications = await getSiteCertifications();

  return (
    <section className="admin-section">
      <header className="admin-section__header">
        <div>
          <p className="admin-section__eyebrow">Admin</p>
          <h1>Trust &amp; Certifications</h1>
          <p className="admin-section__description">
            Add multiple certificates for the homepage Trust &amp;
            Certifications section. They fade between each other automatically.
            Default content stays as fallback until you save.
          </p>
        </div>
      </header>

      <CertificationsForm initial={certifications} />
    </section>
  );
}
