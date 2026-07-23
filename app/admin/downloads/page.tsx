import type { Metadata } from "next";
import Link from "next/link";
import { addDownload, removeDownload } from "@/app/admin/data-actions";
import DownloadForm from "@/app/admin/components/DownloadForm";
import { getServices } from "@/lib/admin-store";
import { requireAdminPage } from "@/lib/require-admin";

export const metadata: Metadata = {
  title: "Downloads | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDownloadsPage() {
  await requireAdminPage();
  const services = await getServices();

  const rows = services.flatMap((service) =>
    service.downloads.map((download) => ({
      serviceId: service.id,
      serviceTitle: service.title,
      download,
    })),
  );

  return (
    <section className="admin-section">
      <header className="admin-section__header">
        <div>
          <p className="admin-section__eyebrow">Admin</p>
          <h1>Downloads</h1>
          <p className="admin-section__description">
            Upload PDFs under each service. Files are saved to{" "}
            <code>public/downloads</code> and shown on the product page.
          </p>
        </div>
      </header>

      <div className="admin-grid">
        <article className="admin-card">
          <h2>Add Download</h2>
          {services.length === 0 ? (
            <p className="admin-empty">
              No services yet.{" "}
              <Link href="/admin/services/new">Create a service</Link> first.
            </p>
          ) : (
            <DownloadForm services={services} action={addDownload} />
          )}
        </article>

        <article className="admin-card admin-card--wide">
          <h2>All Downloads</h2>
          {rows.length === 0 ? (
            <p className="admin-empty">No downloads added yet.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Service</th>
                    <th>File</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ serviceId, serviceTitle, download }) => (
                    <tr key={`${serviceId}-${download.id}`}>
                      <td>{download.title}</td>
                      <td>{serviceTitle}</td>
                      <td>
                        <a
                          href={download.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {download.fileUrl}
                        </a>
                      </td>
                      <td>
                        <form action={removeDownload}>
                          <input
                            type="hidden"
                            name="serviceId"
                            value={serviceId}
                          />
                          <input
                            type="hidden"
                            name="downloadId"
                            value={download.id}
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
