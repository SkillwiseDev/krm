import type { Metadata } from "next";
import Link from "next/link";
import {
  addServiceCategory,
  removeServiceCategory,
} from "@/app/admin/data-actions";
import { getServiceCategories, getServices } from "@/lib/admin-store";
import { requireAdminPage } from "@/lib/require-admin";

export const metadata: Metadata = {
  title: "Service Categories | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ServiceCategoriesPage() {
  await requireAdminPage();
  const [categories, services] = await Promise.all([
    getServiceCategories(),
    getServices(),
  ]);

  const serviceCountByCategory = services.reduce<Record<string, number>>(
    (counts, service) => {
      if (!service.categoryId) {
        return counts;
      }

      counts[service.categoryId] = (counts[service.categoryId] ?? 0) + 1;
      return counts;
    },
    {},
  );

  return (
    <section className="admin-section">
      <header className="admin-section__header">
        <div>
          <p className="admin-section__eyebrow">Admin</p>
          <h1>Product Categories</h1>
          <p className="admin-section__description">
            Create and manage product categories shown on the homepage under
            &quot;Our Products&quot; (e.g. Hematology, Biochemistry). Edit opens
            landing content and hero image settings.
          </p>
        </div>
      </header>

      <div className="admin-grid">
        <article className="admin-card">
          <h2>Add Category</h2>
          <form className="admin-form" action={addServiceCategory}>
            <label>
              Category name
              <input type="text" name="name" placeholder="Hematology" required />
            </label>
            <label>
              Description
              <textarea
                name="description"
                rows={3}
                placeholder="Short category description"
              />
            </label>
            <button type="submit">Save Category</button>
          </form>
        </article>

        <article className="admin-card admin-card--wide">
          <h2>All Categories</h2>
          {categories.length === 0 ? (
            <p className="admin-empty">No service categories added yet.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Services</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.slug}</td>
                      <td>{serviceCountByCategory[category.id] ?? 0}</td>
                      <td>{category.description || "—"}</td>
                      <td className="admin-table__actions">
                        <Link
                          className="admin-button"
                          href={`/admin/service-categories/${category.id}`}
                        >
                          Edit
                        </Link>
                        <form action={removeServiceCategory}>
                          <input type="hidden" name="id" value={category.id} />
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
      </div>
    </section>
  );
}
