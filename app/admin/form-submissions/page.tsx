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

export default async function FormSubmissionsPage() {
  await requireAdminPage();
  const submissions = await getFormSubmissions();
  const newCount = submissions.filter((item) => item.status === "new").length;

  return (
    <section className="admin-section">
      <header className="admin-section__header">
        <div>
          <p className="admin-section__eyebrow">Admin</p>
          <h1>Form Submission</h1>
          <p className="admin-section__description">
            All form submissions from across the website appear here.
            {newCount > 0 ? ` ${newCount} new submission(s) waiting.` : ""}
          </p>
        </div>
      </header>

      <article className="admin-card admin-card--wide">
        {submissions.length === 0 ? (
          <p className="admin-empty">No form submissions yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Form</th>
                  <th>Source</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Requirement</th>
                  <th>Message</th>
                  <th>Extra</th>
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
