import { GridFSBucket } from "mongodb";
import { getMongoDb, isMongoConfigured } from "@/lib/mongodb";

const BUCKET_NAME = "pdfs";

function getBucket(db: Awaited<ReturnType<typeof getMongoDb>>) {
  return new GridFSBucket(db, { bucketName: BUCKET_NAME });
}

export async function savePdfToGridFS(
  filename: string,
  buffer: Buffer,
): Promise<void> {
  if (!isMongoConfigured()) {
    throw new Error("MongoDB is not configured.");
  }

  const db = await getMongoDb();
  const bucket = getBucket(db);
  const existing = await bucket.find({ filename }).toArray();

  await Promise.all(existing.map((file) => bucket.delete(file._id)));

  await new Promise<void>((resolve, reject) => {
    const stream = bucket.openUploadStream(filename, {
      contentType: "application/pdf",
    });
    stream.once("error", reject);
    stream.once("finish", () => resolve());
    stream.end(buffer);
  });
}

export async function getPdfFromGridFS(
  filename: string,
): Promise<{ buffer: Buffer; contentType: string } | null> {
  if (!isMongoConfigured()) {
    return null;
  }

  const db = await getMongoDb();
  const bucket = getBucket(db);
  const files = await bucket.find({ filename }).limit(1).toArray();

  if (files.length === 0) {
    return null;
  }

  const chunks: Buffer[] = [];
  const stream = bucket.openDownloadStreamByName(filename);

  await new Promise<void>((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.once("error", reject);
    stream.once("end", () => resolve());
  });

  return {
    buffer: Buffer.concat(chunks),
    contentType: files[0].contentType || "application/pdf",
  };
}

export async function deletePdfFromGridFS(filename: string): Promise<void> {
  if (!isMongoConfigured()) {
    return;
  }

  const db = await getMongoDb();
  const bucket = getBucket(db);
  const existing = await bucket.find({ filename }).toArray();

  await Promise.all(existing.map((file) => bucket.delete(file._id)));
}
