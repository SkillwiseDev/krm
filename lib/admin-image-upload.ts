import {
  isCloudinaryConfigured,
  uploadImageToCloudinary,
} from "@/lib/cloudinary";

export type AdminImageUploadResult = {
  url?: string;
  error?: string;
};

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export async function uploadAdminImage(
  file: File,
  folder: string,
): Promise<AdminImageUploadResult> {
  if (!isCloudinaryConfigured()) {
    return { error: "Cloudinary is not configured." };
  }

  if (!file.size) {
    return { error: "Please choose an image file." };
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { error: "Only JPG, PNG, WEBP, GIF, or AVIF images are allowed." };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { error: "Image must be 5MB or smaller." };
  }

  try {
    const url = await uploadImageToCloudinary(file, folder);
    return { url };
  } catch {
    return { error: "Image upload failed. Please try again." };
  }
}
