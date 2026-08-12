import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getPdfFromGridFS } from "@/lib/pdf-storage";

export const dynamic = "force-dynamic";

const DOWNLOADS_DIR = path.join(process.cwd(), "public", "downloads");

type DownloadRouteProps = {
  params: Promise<{ filename: string }>;
};

function safeFilename(value: string): string | null {
  const filename = path.basename(decodeURIComponent(value));
  if (!filename || filename.includes("..") || !filename.toLowerCase().endsWith(".pdf")) {
    return null;
  }
  return filename;
}

async function readLocalPdf(filename: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(path.join(DOWNLOADS_DIR, filename));
  } catch {
    return null;
  }
}

export async function GET(_request: Request, { params }: DownloadRouteProps) {
  const { filename: rawFilename } = await params;
  const filename = safeFilename(rawFilename);

  if (!filename) {
    return NextResponse.json({ error: "Invalid file." }, { status: 400 });
  }

  const stored = await getPdfFromGridFS(filename);
  const buffer = stored?.buffer ?? (await readLocalPdf(filename));

  if (!buffer) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": stored?.contentType || "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(buffer.length),
      "Cache-Control": "private, no-store",
    },
  });
}
