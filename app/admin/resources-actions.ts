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
  saveSiteResources,
  type SiteResourceLink,
  type SiteResources,
} from "@/lib/site-resources-store";

async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }
}

function parseLinks(value: FormDataEntryValue | null): SiteResourceLink[] {
  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as SiteResourceLink[];
    return parsed
      .filter((link) => link.title?.trim())
      .map((link) => ({
        id: link.id || crypto.randomUUID(),
        title: link.title.trim(),
        href: link.href?.trim() || "#",
        fileUrl: link.fileUrl?.trim() || undefined,
      }));
  } catch {
    return [];
  }
}

export async function uploadResourcesImage(
  formData: FormData,
): Promise<AdminImageUploadResult> {
  if (!(await isAdminAuthenticated())) {
    return { error: "You must be signed in to upload images." };
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { error: "Please choose an image file." };
  }

  return uploadAdminImage(file, "krm/site/resources");
}

export async function uploadResourceFile(
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

export async function saveHomeResources(formData: FormData): Promise<void> {
  await requireAdmin();

  const title = formData.get("title");
  const imageUrl = formData.get("imageUrl");
  const links = parseLinks(formData.get("links"));

  const resources: SiteResources = {
    title:
      typeof title === "string" && title.trim()
        ? title.trim()
        : "Resources & Downloads",
    imageUrl:
      typeof imageUrl === "string" && imageUrl.trim()
        ? imageUrl.trim()
        : undefined,
    links,
  };

  await saveSiteResources(resources);
  revalidatePath("/admin/resources");
  revalidatePath("/");
  redirectWithToast("/admin/resources", "Resources section updated.");
}
