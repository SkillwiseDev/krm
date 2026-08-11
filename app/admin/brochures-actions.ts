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
  saveProductBrochures,
  type ProductBrochureItem,
  type ProductBrochures,
} from "@/lib/product-brochures-store";

async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }
}

function parseItems(value: FormDataEntryValue | null): ProductBrochureItem[] {
  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as ProductBrochureItem[];
    return parsed
      .filter((item) => item.title?.trim())
      .map((item) => ({
        id: item.id || crypto.randomUUID(),
        title: item.title.trim(),
        fileUrl: item.fileUrl?.trim() || undefined,
      }));
  } catch {
    return [];
  }
}

export async function uploadProductBrochurePdf(
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

export async function saveProductBrochuresAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const title = formData.get("title");
  const items = parseItems(formData.get("items"));

  const brochures: ProductBrochures = {
    title:
      typeof title === "string" && title.trim()
        ? title.trim()
        : "Product Brochures",
    items,
  };

  await saveProductBrochures(brochures);
  revalidatePath("/admin/brochures");
  revalidatePath("/brochures");
  revalidatePath("/");
  redirectWithToast("/admin/brochures", "Product brochures updated.");
}
