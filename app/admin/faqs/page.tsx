import type { Metadata } from "next";
import Link from "next/link";
import ServiceFaqsManager from "@/app/admin/components/ServiceFaqsManager";
import { getServices } from "@/lib/admin-store";
import { requireAdminPage } from "@/lib/require-admin";

export const metadata: Metadata = {
  title: "FAQs | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminFaqsPage() {
  await requireAdminPage();
  const services = await getServices();

  return (
    <section className="admin-section">
      <header className="admin-section__header">
        <div>
          <p className="admin-section__eyebrow">Admin</p>
          <h1>FAQs</h1>
          <p className="admin-section__description">
            Add one FAQ image and up to 5 questions under each service. These
            appear on the product page FAQ section.
          </p>
        </div>
      </header>

      {services.length === 0 ? (
        <article className="admin-card">
          <p className="admin-empty">
            No services yet.{" "}
            <Link href="/admin/services/new">Create a service</Link> first.
          </p>
        </article>
      ) : (
        <ServiceFaqsManager services={services} />
      )}
    </section>
  );
}
