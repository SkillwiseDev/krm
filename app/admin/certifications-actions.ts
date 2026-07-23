"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirectWithToast } from "@/lib/admin-toast";
import { uploadAdminImage, type AdminImageUploadResult } from "@/lib/admin-image-upload";
import {
  uploadAdminPdf,
  type AdminPdfUploadResult,
} from "@/lib/admin-pdf-upload";
import {
  saveSiteCertifications,
  type SiteCertificationItem,
  type SiteCertifications,
} from "@/lib/site-certifications-store";

async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }
}

function parseItems(value: FormDataEntryValue | null): SiteCertificationItem[] {
  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as SiteCertificationItem[];
    return parsed
      .filter((item) => item.cardTitle?.trim())
      .map((item) => ({
        id: item.id || crypto.randomUUID(),
        cardTitle: item.cardTitle.trim(),
        cardDescription: item.cardDescription?.trim() || "",
        imageUrl: item.imageUrl?.trim() || undefined,
        fileUrl: item.fileUrl?.trim() || undefined,
      }));
  } catch {
    return [];
  }
}

export async function uploadCertificationsImage(
  formData: FormData,
): Promise<AdminImageUploadResult> {
  if (!(await isAdminAuthenticated())) {
    return { error: "You must be signed in to upload images." };
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { error: "Please choose an image file." };
  }

  return uploadAdminImage(file, "krm/site/certifications");
}

export async function uploadCertificationsFile(
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

export async function saveHomeCertifications(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const title = formData.get("title");
  const items = parseItems(formData.get("items"));

  const certifications: SiteCertifications = {
    title:
      typeof title === "string" && title.trim()
        ? title.trim()
        : "Trust & Certifications",
    items,
  };

  await saveSiteCertifications(certifications);
  revalidatePath("/admin/certifications");
  revalidatePath("/");
  redirectWithToast("/admin/certifications", "Certifications section updated.");
}
