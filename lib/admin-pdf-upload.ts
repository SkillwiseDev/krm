import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { isMongoConfigured } from "@/lib/mongodb";
import {
  deletePdfFromGridFS,
  savePdfToGridFS,
} from "@/lib/pdf-storage";

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

function filenameFromUrl(fileUrl: string): string | null {
  if (!fileUrl.startsWith("/downloads/")) {
    return null;
  }

  const filename = path.basename(fileUrl);
  if (!filename || filename.includes("..")) {
    return null;
  }

  return filename;
}

/**
 * Saves PDFs to MongoDB (production-safe) and serves them from `/downloads/<filename>`.
 * Local fallback writes to `public/downloads` when Mongo is not configured.
 */
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

  const baseName = slugifyFilename(file.name) || "document";
  const filename = `${baseName}-${crypto.randomUUID().slice(0, 8)}.pdf`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    if (isMongoConfigured()) {
      await savePdfToGridFS(filename, buffer);
      return { url: `/downloads/${filename}` };
    }

    await fs.mkdir(DOWNLOADS_DIR, { recursive: true });
    const filePath = path.join(DOWNLOADS_DIR, filename);
    await fs.writeFile(filePath, buffer);
    await fs.access(filePath);

    return { url: `/downloads/${filename}` };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown upload error";
    console.error("[uploadAdminPdf]", message);
    return {
      error: `PDF upload failed. ${message}`,
    };
  }
}

export async function deletePublicDownloadFile(
  fileUrl: string | undefined,
): Promise<void> {
  const filename = fileUrl ? filenameFromUrl(fileUrl) : null;
  if (!filename) {
    return;
  }

  await deletePdfFromGridFS(filename);

  try {
    await fs.unlink(path.join(DOWNLOADS_DIR, filename));
  } catch {
    // File may already be missing.
  }
}
