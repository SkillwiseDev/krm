import type { Metadata } from "next";
import BrochuresForm from "@/app/admin/components/BrochuresForm";
import { getProductBrochures } from "@/lib/product-brochures-store";
import { requireAdminPage } from "@/lib/require-admin";

export const metadata: Metadata = {
  title: "Product Brochures | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminBrochuresPage() {
  await requireAdminPage();
  const brochures = await getProductBrochures();

  return (
    <section className="admin-section">
      <header className="admin-section__header">
        <div>
          <p className="admin-section__eyebrow">Admin</p>
          <h1>Product Brochures</h1>
          <p className="admin-section__description">
            Upload brochure titles and PDFs. They appear on the public Product
            Brochures page linked from Resources &amp; Downloads.
          </p>
        </div>
      </header>

      <BrochuresForm initial={brochures} />
    </section>
  );
}
