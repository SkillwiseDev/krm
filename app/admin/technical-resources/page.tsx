import type { Metadata } from "next";
import TechnicalResourcesForm from "@/app/admin/components/TechnicalResourcesForm";
import { getTechnicalResources } from "@/lib/technical-resources-store";
import { requireAdminPage } from "@/lib/require-admin";

export const metadata: Metadata = {
  title: "Technical Resources | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminTechnicalResourcesPage() {
  await requireAdminPage();
  const resources = await getTechnicalResources();

  return (
    <section className="admin-section">
      <header className="admin-section__header">
        <div>
          <p className="admin-section__eyebrow">Admin</p>
          <h1>Technical Resources</h1>
          <p className="admin-section__description">
            Manage the three Technical Resources on the Services page — content
            and PDF downloads (saved under public/downloads).
          </p>
        </div>
      </header>

      <TechnicalResourcesForm initialItems={resources.items} />
    </section>
  );
}
