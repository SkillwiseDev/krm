import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  addApplication,
  removeApplication,
} from "@/app/admin/data-actions";
import ApplicationForm from "@/app/admin/components/ApplicationForm";
import { getServices } from "@/lib/admin-store";
import { requireAdminPage } from "@/lib/require-admin";

export const metadata: Metadata = {
  title: "Applications | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminApplicationsPage() {
  await requireAdminPage();
  const services = await getServices();

  const rows = services.flatMap((service) =>
    service.applications.map((application) => ({
      serviceId: service.id,
      serviceTitle: service.title,
      application,
    })),
  );

  return (
    <section className="admin-section">
      <header className="admin-section__header">
        <div>
          <p className="admin-section__eyebrow">Admin</p>
          <h1>Applications</h1>
          <p className="admin-section__description">
            Add application cards under each service. These appear in the
            Applications carousel on the product page.
          </p>
        </div>
      </header>

      <div className="admin-grid">
        <article className="admin-card">
          <h2>Add Application</h2>
          {services.length === 0 ? (
            <p className="admin-empty">
              No services yet.{" "}
              <Link href="/admin/services/new">Create a service</Link> first.
            </p>
          ) : (
            <ApplicationForm services={services} action={addApplication} />
          )}
        </article>

        <article className="admin-card admin-card--wide">
          <h2>All Applications</h2>
          {rows.length === 0 ? (
            <p className="admin-empty">No applications added yet.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Icon</th>
                    <th>Title</th>
                    <th>Service</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ serviceId, serviceTitle, application }) => (
                    <tr key={`${serviceId}-${application.id}`}>
                      <td>
                        {application.iconUrl ? (
                          <Image
                            className="admin-application-icon"
                            src={application.iconUrl}
                            alt=""
                            width={48}
                            height={48}
                          />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>{application.title}</td>
                      <td>{serviceTitle}</td>
                      <td>
                        <form action={removeApplication}>
                          <input
                            type="hidden"
                            name="serviceId"
                            value={serviceId}
                          />
                          <input
                            type="hidden"
                            name="applicationId"
                            value={application.id}
                          />
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
