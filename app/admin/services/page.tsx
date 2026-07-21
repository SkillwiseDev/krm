import type { Metadata } from "next";
import Link from "next/link";
import { removeService } from "@/app/admin/data-actions";
import { getServiceCategories, getServices } from "@/lib/admin-store";
import { requireAdminPage } from "@/lib/require-admin";

export const metadata: Metadata = {
  title: "Services | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminServicesPage() {
  await requireAdminPage();
  const [categories, services] = await Promise.all([
    getServiceCategories(),
    getServices(),
  ]);

  const categoryMap = new Map(
    categories.map((category) => [category.id, category.name]),
  );

  return (
    <section className="admin-section">
      <header className="admin-section__header">
        <div>
          <p className="admin-section__eyebrow">Admin</p>
          <h1>Services</h1>
          <p className="admin-section__description">
            Manage detailed service content with overview, features, and
            technical specifications. Category is optional.
          </p>
        </div>
        <Link className="admin-button" href="/admin/services/new">
          Add Service
        </Link>
      </header>

      <article className="admin-card admin-card--wide">
        {services.length === 0 ? (
          <p className="admin-empty">
            No services added yet.{" "}
            <Link href="/admin/services/new">Create your first service</Link>
          </p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Tagline</th>
                  <th>Specs</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>{service.title}</td>
                    <td>
                      {service.categoryId
                        ? categoryMap.get(service.categoryId) || "—"
                        : "—"}
                    </td>
                    <td>{service.tagline || service.summary || "—"}</td>
                    <td>{service.specifications.length}</td>
                    <td className="admin-table__actions">
                      <Link
                        className="admin-button"
                        href={`/admin/services/${service.id}`}
                      >
                        Edit details
                      </Link>
                      <form action={removeService}>
                        <input type="hidden" name="id" value={service.id} />
                        <button
                          className="admin-button admin-button--danger"
                          type="submit"
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
