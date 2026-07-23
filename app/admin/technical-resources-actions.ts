"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirectWithToast } from "@/lib/admin-toast";
import {
  uploadAdminPdf,
  type AdminPdfUploadResult,
} from "@/lib/admin-pdf-upload";
import {
  saveTechnicalResources,
  type TechnicalResourceItem,
  type TechnicalResources,
} from "@/lib/technical-resources-store";

async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }
}

function parseItems(
  value: FormDataEntryValue | null,
): TechnicalResourceItem[] {
  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as TechnicalResourceItem[];
    return parsed.map((item) => ({
      id: item.id || crypto.randomUUID(),
      title: item.title?.trim() || "Resource",
      content: item.content?.trim() || "",
      fileUrl: item.fileUrl?.trim() || undefined,
    }));
  } catch {
    return [];
  }
}

export async function uploadTechnicalResourcePdf(
  formData: FormData,
): Promise<AdminPdfUploadResult> {
  if (!(await isAdminAuthenticated())) {
    return { error: "You must be signed in to upload files." };
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { error: "Please choose a PDF file." };
  }

  return uploadAdminPdf(file);
}

export async function saveTechnicalResourcesAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const items = parseItems(formData.get("items"));
  const resources: TechnicalResources = { items };

  await saveTechnicalResources(resources);
  revalidatePath("/admin/technical-resources");
  revalidatePath("/services");
  redirectWithToast(
    "/admin/technical-resources",
    "Technical resources updated.",
  );
}
