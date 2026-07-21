"use server";

import { createFormSubmission } from "@/lib/admin-store";

export type SiteFormState = {
  success?: boolean;
  error?: string;
};

const STANDARD_FIELDS = new Set([
  "formName",
  "sourcePage",
  "sourcePath",
  "firstName",
  "organization",
  "phone",
  "email",
  "requirementType",
  "message",
]);

function getString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getExtraFields(formData: FormData): Record<string, string> | undefined {
  const extra: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    if (STANDARD_FIELDS.has(key) || typeof value !== "string" || !value.trim()) {
      continue;
    }

    extra[key] = value.trim();
  }

  return Object.keys(extra).length > 0 ? extra : undefined;
}

export async function submitSiteForm(
  _prevState: SiteFormState,
  formData: FormData,
): Promise<SiteFormState> {
  const firstName = getString(formData, "firstName");
  const phone = getString(formData, "phone");
  const email = getString(formData, "email");

  if (!firstName) {
    return { error: "Name is required." };
  }

  if (!phone) {
    return { error: "Phone number is required." };
  }

  if (!email) {
    return { error: "Email address is required." };
  }

  try {
    await createFormSubmission({
      formName: getString(formData, "formName") ?? "Website Form",
      sourcePage: getString(formData, "sourcePage") ?? "Website",
      sourcePath: getString(formData, "sourcePath") ?? "/",
      firstName,
      organization: getString(formData, "organization"),
      phone,
      email,
      requirementType: getString(formData, "requirementType"),
      message: getString(formData, "message"),
      extraFields: getExtraFields(formData),
    });
  } catch {
    return {
      error: "Could not save your submission right now. Please try again.",
    };
  }

  return { success: true };
}
