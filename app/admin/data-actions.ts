"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  createService,
  createServiceCategory,
  deleteFormSubmission,
  deleteService,
  deleteServiceCategory,
  markFormSubmissionRead,
  updateService,
} from "@/lib/admin-store";
import {
  parseFeatureSections,
  parseSpecifications,
  type ServiceInput,
} from "@/lib/service-content";
import { uploadAdminImage, type AdminImageUploadResult } from "@/lib/admin-image-upload";

export type ServiceHeroImageUploadResult = AdminImageUploadResult;

async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }
}

export async function addServiceCategory(formData: FormData): Promise<void> {
  await requireAdmin();

  const name = formData.get("name");
  const description = formData.get("description");

  if (typeof name !== "string" || !name.trim()) {
    return;
  }

  await createServiceCategory({
    name,
    description: typeof description === "string" ? description : undefined,
  });

  revalidatePath("/admin/service-categories");
}

export async function removeServiceCategory(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return;
  }

  await deleteServiceCategory(id);
  revalidatePath("/admin/service-categories");
  revalidatePath("/admin/services");
}

function parseServiceInput(formData: FormData): ServiceInput | null {
  const categoryId = formData.get("categoryId");
  const title = formData.get("title");
  const tagline = formData.get("tagline");
  const summary = formData.get("summary");
  const overview = formData.get("overview");
  const advantageTitle = formData.get("advantageTitle");
  const advantageContent = formData.get("advantageContent");
  const closingTitle = formData.get("closingTitle");
  const closingDescription = formData.get("closingDescription");
  const heroImageUrl = formData.get("heroImageUrl");

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof tagline !== "string" ||
    !tagline.trim()
  ) {
    return null;
  }

  return {
    categoryId:
      typeof categoryId === "string" && categoryId.trim()
        ? categoryId.trim()
        : undefined,
    title,
    tagline,
    summary: typeof summary === "string" ? summary : tagline,
    heroImageUrl:
      typeof heroImageUrl === "string" && heroImageUrl.trim()
        ? heroImageUrl.trim()
        : undefined,
    overview: typeof overview === "string" ? overview : "",
    featureSections: parseFeatureSections(formData.get("featureSections")),
    specifications: parseSpecifications(formData.get("specifications")),
    advantageTitle: typeof advantageTitle === "string" ? advantageTitle : "",
    advantageContent:
      typeof advantageContent === "string" ? advantageContent : "",
    closingTitle: typeof closingTitle === "string" ? closingTitle : "",
    closingDescription:
      typeof closingDescription === "string" ? closingDescription : "",
  };
}

export async function saveService(formData: FormData): Promise<void> {
  await requireAdmin();

  const input = parseServiceInput(formData);

  if (!input) {
    redirect("/admin/services");
  }

  const id = formData.get("id");

  if (typeof id === "string" && id) {
    await updateService(id, input);
    revalidatePath("/admin/services");
    revalidatePath(`/admin/services/${id}`);
    redirect(`/admin/services/${id}`);
  }

  const service = await createService(input);
  revalidatePath("/admin/services");
  redirect(`/admin/services/${service.id}`);
}

export async function removeService(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return;
  }

  await deleteService(id);
  revalidatePath("/admin/services");
}

export async function uploadServiceHeroImage(
  formData: FormData,
): Promise<ServiceHeroImageUploadResult> {
  if (!(await isAdminAuthenticated())) {
    return { error: "You must be signed in to upload images." };
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { error: "Please choose an image file." };
  }

  return uploadAdminImage(file, "krm/services/hero");
}

export async function readFormSubmission(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return;
  }

  await markFormSubmissionRead(id);
  revalidatePath("/admin/form-submissions");
}

export async function removeFormSubmission(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return;
  }

  await deleteFormSubmission(id);
  revalidatePath("/admin/form-submissions");
}
