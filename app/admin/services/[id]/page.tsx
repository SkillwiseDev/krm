import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ServiceDetailForm from "@/app/admin/components/ServiceDetailForm";
import ServiceDetailPreview from "@/app/admin/components/ServiceDetailPreview";
import { saveService } from "@/app/admin/data-actions";
import { getServiceById, getServiceCategories } from "@/lib/admin-store";
import { requireAdminPage } from "@/lib/require-admin";

export const metadata: Metadata = {
  title: "Edit Service | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type EditServicePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditServicePage({ params }: EditServicePageProps) {
  await requireAdminPage();
  const { id } = await params;
  const [service, categories] = await Promise.all([
    getServiceById(id),
    getServiceCategories(),
  ]);

  if (!service) {
    notFound();
  }

  return (
    <section className="admin-section">
      <header className="admin-section__header">
        <div>
          <Link className="admin-service-form__back" href="/admin/services">
            Back to Services
          </Link>
          <p className="admin-section__eyebrow">Admin</p>
          <h1>Edit Service Details</h1>
          <p className="admin-section__description">
            Update full service content including overview, features, and
            technical specifications table.
          </p>
        </div>
      </header>

      <div className="admin-service-layout">
        <ServiceDetailForm
          action={saveService}
          categories={categories}
          initialService={service}
        />
        <ServiceDetailPreview service={service} />
      </div>
    </section>
  );
}
