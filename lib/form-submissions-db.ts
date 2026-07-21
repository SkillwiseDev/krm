import type { FormSubmission } from "@/lib/admin-store";
import { getMongoDb, isMongoConfigured } from "@/lib/mongodb";
import { normalizeFormSubmission } from "@/lib/form-submission-display";

const COLLECTION = "form_submissions";

type FormSubmissionDocument = FormSubmission & {
  _id?: string;
};

function toFormSubmission(document: FormSubmissionDocument): FormSubmission {
  return normalizeFormSubmission({
    id: document.id,
    formName: document.formName,
    sourcePage: document.sourcePage,
    sourcePath: document.sourcePath,
    firstName: document.firstName,
    organization: document.organization,
    phone: document.phone,
    email: document.email,
    requirementType: document.requirementType,
    message: document.message,
    extraFields: document.extraFields,
    status: document.status,
    createdAt: document.createdAt,
  });
}

export async function insertFormSubmissionMongo(
  submission: FormSubmission,
): Promise<void> {
  if (!isMongoConfigured()) {
    return;
  }

  const db = await getMongoDb();
  await db.collection<FormSubmissionDocument>(COLLECTION).insertOne(submission);
}

export async function getFormSubmissionsMongo(): Promise<FormSubmission[]> {
  if (!isMongoConfigured()) {
    return [];
  }

  const db = await getMongoDb();
  const documents = await db
    .collection<FormSubmissionDocument>(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return documents.map(toFormSubmission);
}

export async function markFormSubmissionReadMongo(id: string): Promise<void> {
  if (!isMongoConfigured()) {
    return;
  }

  const db = await getMongoDb();
  await db
    .collection<FormSubmissionDocument>(COLLECTION)
    .updateOne({ id }, { $set: { status: "read" } });
}

export async function deleteFormSubmissionMongo(id: string): Promise<void> {
  if (!isMongoConfigured()) {
    return;
  }

  const db = await getMongoDb();
  await db.collection<FormSubmissionDocument>(COLLECTION).deleteOne({ id });
}
