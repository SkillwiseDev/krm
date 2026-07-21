import type { FormSubmission } from "@/lib/admin-store";

export function normalizeFormSubmission(
  submission: Partial<FormSubmission> & Pick<FormSubmission, "id" | "createdAt">,
): FormSubmission {
  return {
    id: submission.id,
    formName: submission.formName ?? "Contact Enquiry",
    sourcePage: submission.sourcePage ?? "Contact",
    sourcePath: submission.sourcePath ?? "/contact",
    firstName: submission.firstName ?? "—",
    organization: submission.organization,
    phone: submission.phone ?? "—",
    email: submission.email ?? "—",
    requirementType: submission.requirementType,
    message: submission.message,
    extraFields: submission.extraFields,
    status: submission.status ?? "new",
    createdAt: submission.createdAt,
  };
}

export function formatExtraFields(
  extraFields?: Record<string, string>,
): string {
  if (!extraFields || Object.keys(extraFields).length === 0) {
    return "—";
  }

  return Object.entries(extraFields)
    .map(([key, value]) => `${key}: ${value}`)
    .join(" · ");
}
