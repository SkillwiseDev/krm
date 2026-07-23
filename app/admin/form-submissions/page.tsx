import type { Metadata } from "next";
import {
  readFormSubmission,
  removeFormSubmission,
} from "@/app/admin/data-actions";
import { getFormSubmissions } from "@/lib/admin-store";
import { formatExtraFields } from "@/lib/form-submission-display";
import { requireAdminPage } from "@/lib/require-admin";

export const metadata: Metadata = {
  title: "Form Submissions | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

type FormSubmissionsPageProps = {
  searchParams: Promise<{
    form?: string;
  }>;
};

export default async function FormSubmissionsPage({
  searchParams,
}: FormSubmissionsPageProps) {
  await requireAdminPage();
  const params = await searchParams;
  const formFilter = params.form?.trim();
  const allSubmissions = await getFormSubmissions();
  const submissions = formFilter
    ? allSubmissions.filter((item) => item.formName === formFilter)
    : allSubmissions;
  const newCount = submissions.filter((item) => item.status === "new").length;
  const isBookingsView = formFilter === "Booking";
  const isResourceDownloadsView =
    formFilter === "Technical Resource Download";

  return (
    <section className="admin-section">
      <header className="admin-section__header">
        <div>
          <p className="admin-section__eyebrow">Admin</p>
          <h1>
            {isBookingsView
              ? "Bookings"
              : isResourceDownloadsView
                ? "Resource Downloads"
                : "Form Submission"}
          </h1>
          <p className="admin-section__description">
            {isBookingsView
              ? "All booking requests from the Book Now form appear here."
              : isResourceDownloadsView
                ? "Leads who requested a Technical Resource PDF download appear here."
                : "All form submissions from across the website appear here."}
            {newCount > 0 ? ` ${newCount} new submission(s) waiting.` : ""}
          </p>
        </div>
      </header>

      <article className="admin-card admin-card--wide">
        {submissions.length === 0 ? (
          <p className="admin-empty">
            {isBookingsView
              ? "No bookings yet."
              : isResourceDownloadsView
                ? "No resource download requests yet."
                : "No form submissions yet."}
          </p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Form</th>
                  <th>Source</th>
                  <th>Name</th>
                  <th>Organization</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Requirement</th>
                  <th>Message</th>
                  <th>Booking details</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>
                      <span
                        className={`admin-badge admin-badge--${submission.status}`}
                      >
                        {submission.status}
                      </span>
                    </td>
                    <td>{submission.formName}</td>
                    <td>
                      <span className="admin-table__source">
                        {submission.sourcePage}
                        <small>{submission.sourcePath}</small>
                      </span>
                    </td>
                    <td>{submission.firstName}</td>
                    <td>{submission.organization || "—"}</td>
                    <td>{submission.email}</td>
                    <td>{submission.phone}</td>
                    <td>{submission.requirementType || "—"}</td>
                    <td>{submission.message || "—"}</td>
                    <td>{formatExtraFields(submission.extraFields)}</td>
                    <td>{formatDate(submission.createdAt)}</td>
                    <td className="admin-table__actions">
                      {submission.status === "new" ? (
                        <form action={readFormSubmission}>
                          <input type="hidden" name="id" value={submission.id} />
                          <button className="admin-button" type="submit">
                            Mark read
                          </button>
                        </form>
                      ) : null}
                      <form action={removeFormSubmission}>
                        <input type="hidden" name="id" value={submission.id} />
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
