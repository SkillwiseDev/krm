import type { Metadata } from "next";
import ResourcesForm from "@/app/admin/components/ResourcesForm";
import { getSiteResources } from "@/lib/site-resources-store";
import { requireAdminPage } from "@/lib/require-admin";

export const metadata: Metadata = {
  title: "Resources & Downloads | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminResourcesPage() {
  await requireAdminPage();
  const resources = await getSiteResources();

  return (
    <section className="admin-section">
      <header className="admin-section__header">
        <div>
          <p className="admin-section__eyebrow">Admin</p>
          <h1>Resources &amp; Downloads</h1>
          <p className="admin-section__description">
            Update the homepage Resources &amp; Downloads section — heading,
            side image, and resource links.
          </p>
        </div>
      </header>

      <ResourcesForm initial={resources} />
    </section>
  );
}
