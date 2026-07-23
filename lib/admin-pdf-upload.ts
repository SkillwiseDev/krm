import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export type AdminPdfUploadResult = {
  url?: string;
  error?: string;
};

const MAX_PDF_SIZE_BYTES = 20 * 1024 * 1024;
const DOWNLOADS_DIR = path.join(process.cwd(), "public", "downloads");

function slugifyFilename(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\.pdf$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function uploadAdminPdf(file: File): Promise<AdminPdfUploadResult> {
  if (!file.size) {
    return { error: "Please choose a PDF file." };
  }

  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    return { error: "Only PDF files are allowed." };
  }

  if (file.size > MAX_PDF_SIZE_BYTES) {
    return { error: "PDF must be 20MB or smaller." };
  }

  try {
    await fs.mkdir(DOWNLOADS_DIR, { recursive: true });

    const baseName = slugifyFilename(file.name) || "document";
    const filename = `${baseName}-${crypto.randomUUID().slice(0, 8)}.pdf`;
    const filePath = path.join(DOWNLOADS_DIR, filename);
    const buffer = Buffer.from(await file.arrayBuffer());

    await fs.writeFile(filePath, buffer);

    return { url: `/downloads/${filename}` };
  } catch {
    return { error: "PDF upload failed. Please try again." };
  }
}

export async function deletePublicDownloadFile(
  fileUrl: string | undefined,
): Promise<void> {
  if (!fileUrl?.startsWith("/downloads/")) {
    return;
  }

  const filename = path.basename(fileUrl);
  if (!filename || filename.includes("..")) {
    return;
  }

  try {
    await fs.unlink(path.join(DOWNLOADS_DIR, filename));
  } catch {
    // File may already be missing.
  }
}
