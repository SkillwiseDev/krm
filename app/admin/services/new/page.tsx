import type { Metadata } from "next";
import Link from "next/link";
import ServiceDetailForm from "@/app/admin/components/ServiceDetailForm";
import { saveService } from "@/app/admin/data-actions";
import { getServiceCategories } from "@/lib/admin-store";
import { requireAdminPage } from "@/lib/require-admin";

export const metadata: Metadata = {
  title: "Add Service | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewServicePage() {
  await requireAdminPage();
  const categories = await getServiceCategories();

  return (
    <section className="admin-section">
      <header className="admin-section__header">
        <div>
          <Link className="admin-service-form__back" href="/admin/services">
            Back to Services
          </Link>
          <p className="admin-section__eyebrow">Admin</p>
          <h1>Add Service Details</h1>
          <p className="admin-section__description">
            Create a detailed service page with overview, features, and a
            technical specifications table. Category is optional.
          </p>
        </div>
      </header>

      <ServiceDetailForm action={saveService} categories={categories} />
    </section>
  );
}
