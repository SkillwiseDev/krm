"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirectWithToast } from "@/lib/admin-toast";
import {
  addServiceApplication,
  addServiceDownload,
  addServiceFaq,
  createService,
  createServiceCategory,
  deleteFormSubmission,
  deleteService,
  deleteServiceApplication,
  deleteServiceCategory,
  deleteServiceDownload,
  deleteServiceFaq,
  getServiceById,
  markFormSubmissionRead,
  setServiceFaqsImage,
  updateService,
} from "@/lib/admin-store";
import {
  parseFeatureSections,
  parseSpecifications,
  type ServiceInput,
} from "@/lib/service-content";
import { uploadAdminImage, type AdminImageUploadResult } from "@/lib/admin-image-upload";
import {
  deletePublicDownloadFile,
  uploadAdminPdf,
  type AdminPdfUploadResult,
} from "@/lib/admin-pdf-upload";

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
    redirectWithToast(
      "/admin/service-categories",
      "Category name is required.",
      "error",
    );
  }

  await createServiceCategory({
    name,
    description: typeof description === "string" ? description : undefined,
  });

  revalidatePath("/admin/service-categories");
  revalidatePath("/");
  redirectWithToast("/admin/service-categories", "Category created.");
}

export async function removeServiceCategory(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    redirectWithToast(
      "/admin/service-categories",
      "Category could not be deleted.",
      "error",
    );
  }

  await deleteServiceCategory(id);
  revalidatePath("/admin/service-categories");
  revalidatePath("/admin/services");
  revalidatePath("/");
  redirectWithToast("/admin/service-categories", "Category deleted.");
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
    redirectWithToast(
      "/admin/services",
      "Service title and tagline are required.",
      "error",
    );
  }

  const id = formData.get("id");

  if (typeof id === "string" && id) {
    await updateService(id, input);
    revalidatePath("/admin/services");
    revalidatePath(`/admin/services/${id}`);
    redirectWithToast(`/admin/services/${id}`, "Service updated.");
  }

  const service = await createService(input);
  revalidatePath("/admin/services");
  redirectWithToast(`/admin/services/${service.id}`, "Service created.");
}

export async function removeService(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    redirectWithToast("/admin/services", "Service could not be deleted.", "error");
  }

  await deleteService(id);
  revalidatePath("/admin/services");
  redirectWithToast("/admin/services", "Service deleted.");
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

export async function uploadApplicationIcon(
  formData: FormData,
): Promise<ServiceHeroImageUploadResult> {
  if (!(await isAdminAuthenticated())) {
    return { error: "You must be signed in to upload images." };
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { error: "Please choose an image file." };
  }

  return uploadAdminImage(file, "krm/services/applications");
}

export async function addApplication(formData: FormData): Promise<void> {
  await requireAdmin();

  const serviceId = formData.get("serviceId");
  const title = formData.get("title");
  const iconUrl = formData.get("iconUrl");

  if (
    typeof serviceId !== "string" ||
    !serviceId ||
    typeof title !== "string" ||
    !title.trim()
  ) {
    redirectWithToast(
      "/admin/applications",
      "Application title is required.",
      "error",
    );
  }

  await addServiceApplication(serviceId, {
    title,
    iconUrl:
      typeof iconUrl === "string" && iconUrl.trim() ? iconUrl.trim() : undefined,
  });

  const service = await getServiceById(serviceId);
  revalidatePath("/admin/applications");
  revalidatePath("/admin/services");
  revalidatePath("/services");
  if (service) {
    revalidatePath(`/products/${service.slug}`);
  }
  redirectWithToast("/admin/applications", "Application added.");
}

export async function removeApplication(formData: FormData): Promise<void> {
  await requireAdmin();

  const serviceId = formData.get("serviceId");
  const applicationId = formData.get("applicationId");

  if (
    typeof serviceId !== "string" ||
    !serviceId ||
    typeof applicationId !== "string" ||
    !applicationId
  ) {
    redirectWithToast(
      "/admin/applications",
      "Application could not be deleted.",
      "error",
    );
  }

  const service = await getServiceById(serviceId);
  await deleteServiceApplication(serviceId, applicationId);
  revalidatePath("/admin/applications");
  revalidatePath("/admin/services");
  revalidatePath("/services");
  if (service) {
    revalidatePath(`/products/${service.slug}`);
  }
  redirectWithToast("/admin/applications", "Application deleted.");
}

export async function uploadServiceDownloadPdf(
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

export async function addDownload(formData: FormData): Promise<void> {
  await requireAdmin();

  const serviceId = formData.get("serviceId");
  const title = formData.get("title");
  const fileUrl = formData.get("fileUrl");

  if (
    typeof serviceId !== "string" ||
    !serviceId ||
    typeof title !== "string" ||
    !title.trim() ||
    typeof fileUrl !== "string" ||
    !fileUrl.trim()
  ) {
    redirectWithToast(
      "/admin/downloads",
      "Download title and PDF are required.",
      "error",
    );
  }

  await addServiceDownload(serviceId, {
    title,
    fileUrl: fileUrl.trim(),
  });

  const service = await getServiceById(serviceId);
  revalidatePath("/admin/downloads");
  revalidatePath("/admin/services");
  revalidatePath("/services");
  if (service) {
    revalidatePath(`/products/${service.slug}`);
  }
  redirectWithToast("/admin/downloads", "Download added.");
}

export async function removeDownload(formData: FormData): Promise<void> {
  await requireAdmin();

  const serviceId = formData.get("serviceId");
  const downloadId = formData.get("downloadId");

  if (
    typeof serviceId !== "string" ||
    !serviceId ||
    typeof downloadId !== "string" ||
    !downloadId
  ) {
    redirectWithToast(
      "/admin/downloads",
      "Download could not be deleted.",
      "error",
    );
  }

  const service = await getServiceById(serviceId);
  const removed = await deleteServiceDownload(serviceId, downloadId);

  if (removed) {
    await deletePublicDownloadFile(removed.fileUrl);
  }

  revalidatePath("/admin/downloads");
  revalidatePath("/admin/services");
  revalidatePath("/services");
  if (service) {
    revalidatePath(`/products/${service.slug}`);
  }
  redirectWithToast("/admin/downloads", "Download deleted.");
}

export async function uploadServiceFaqsImage(
  formData: FormData,
): Promise<ServiceHeroImageUploadResult> {
  if (!(await isAdminAuthenticated())) {
    return { error: "You must be signed in to upload images." };
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { error: "Please choose an image file." };
  }

  return uploadAdminImage(file, "krm/services/faqs");
}

export async function saveFaqsImage(formData: FormData): Promise<void> {
  await requireAdmin();

  const serviceId = formData.get("serviceId");
  const imageUrl = formData.get("imageUrl");

  if (typeof serviceId !== "string" || !serviceId) {
    redirectWithToast("/admin/faqs", "Select a service first.", "error");
  }

  await setServiceFaqsImage(
    serviceId,
    typeof imageUrl === "string" && imageUrl.trim() ? imageUrl.trim() : undefined,
  );

  const service = await getServiceById(serviceId);
  revalidatePath("/admin/faqs");
  revalidatePath("/admin/services");
  if (service) {
    revalidatePath(`/products/${service.slug}`);
  }
  redirectWithToast("/admin/faqs", "FAQ image saved.");
}

export async function clearFaqsImage(formData: FormData): Promise<void> {
  await requireAdmin();

  const serviceId = formData.get("serviceId");

  if (typeof serviceId !== "string" || !serviceId) {
    redirectWithToast("/admin/faqs", "Select a service first.", "error");
  }

  await setServiceFaqsImage(serviceId, undefined);

  const service = await getServiceById(serviceId);
  revalidatePath("/admin/faqs");
  revalidatePath("/admin/services");
  if (service) {
    revalidatePath(`/products/${service.slug}`);
  }
  redirectWithToast("/admin/faqs", "FAQ image removed.");
}

export async function addFaq(formData: FormData): Promise<void> {
  await requireAdmin();

  const serviceId = formData.get("serviceId");
  const question = formData.get("question");

  if (
    typeof serviceId !== "string" ||
    !serviceId ||
    typeof question !== "string" ||
    !question.trim()
  ) {
    redirectWithToast("/admin/faqs", "FAQ question is required.", "error");
  }

  const created = await addServiceFaq(serviceId, question);

  if (!created) {
    redirectWithToast(
      "/admin/faqs",
      "Could not add FAQ. Max 5 FAQs per service.",
      "error",
    );
  }

  const service = await getServiceById(serviceId);
  revalidatePath("/admin/faqs");
  revalidatePath("/admin/services");
  if (service) {
    revalidatePath(`/products/${service.slug}`);
  }
  redirectWithToast("/admin/faqs", "FAQ added.");
}

export async function removeFaq(formData: FormData): Promise<void> {
  await requireAdmin();

  const serviceId = formData.get("serviceId");
  const faqId = formData.get("faqId");

  if (
    typeof serviceId !== "string" ||
    !serviceId ||
    typeof faqId !== "string" ||
    !faqId
  ) {
    redirectWithToast("/admin/faqs", "FAQ could not be deleted.", "error");
  }

  const service = await getServiceById(serviceId);
  await deleteServiceFaq(serviceId, faqId);
  revalidatePath("/admin/faqs");
  revalidatePath("/admin/services");
  if (service) {
    revalidatePath(`/products/${service.slug}`);
  }
  redirectWithToast("/admin/faqs", "FAQ deleted.");
}

export async function readFormSubmission(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    redirectWithToast(
      "/admin/form-submissions",
      "Submission could not be updated.",
      "error",
    );
  }

  await markFormSubmissionRead(id);
  revalidatePath("/admin/form-submissions");
  redirectWithToast("/admin/form-submissions", "Marked as read.");
}

export async function removeFormSubmission(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    redirectWithToast(
      "/admin/form-submissions",
      "Submission could not be deleted.",
      "error",
    );
  }

  await deleteFormSubmission(id);
  revalidatePath("/admin/form-submissions");
  redirectWithToast("/admin/form-submissions", "Submission deleted.");
}
