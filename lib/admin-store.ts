import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { normalizeFormSubmission } from "@/lib/form-submission-display";
import {
  deleteFormSubmissionMongo,
  getFormSubmissionsMongo,
  insertFormSubmissionMongo,
  markFormSubmissionReadMongo,
} from "@/lib/form-submissions-db";
import { isMongoConfigured } from "@/lib/mongodb";
import {
  deleteServiceCategoryMongo,
  deleteServiceMongo,
  deleteServicesByCategoryMongo,
  getServiceCategoriesMongo,
  getServiceCategoryBySlugMongo,
  getServiceCategoryMongo,
  getServiceByIdMongo,
  getServicesByCategoryMongo,
  getServicesMongo,
  insertServiceCategoryMongo,
  insertServiceMongo,
  updateServiceMongo,
} from "@/lib/services-db";
import { normalizeService, type ServiceInput } from "@/lib/service-content";

const STORE_PATH = path.join(process.cwd(), "data", "admin-store.json");

export type ServiceCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
};

export type ServiceFeatureSection = {
  title: string;
  items: string[];
};

export type ServiceSpecification = {
  label: string;
  detail: string;
};

export type Service = {
  id: string;
  categoryId?: string;
  title: string;
  slug: string;
  tagline: string;
  summary: string;
  heroImageUrl?: string;
  overview: string;
  featureSections: ServiceFeatureSection[];
  specifications: ServiceSpecification[];
  advantageTitle: string;
  advantageContent: string;
  closingTitle: string;
  closingDescription: string;
  createdAt: string;
  updatedAt: string;
};

export type FormSubmission = {
  id: string;
  formName: string;
  sourcePage: string;
  sourcePath: string;
  firstName: string;
  organization?: string;
  phone: string;
  email: string;
  requirementType?: string;
  message?: string;
  extraFields?: Record<string, string>;
  status: "new" | "read";
  createdAt: string;
};

type AdminStore = {
  serviceCategories: ServiceCategory[];
  services: Service[];
  formSubmissions: FormSubmission[];
};

const DEFAULT_STORE: AdminStore = {
  serviceCategories: [],
  services: [],
  formSubmissions: [],
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function createId(): string {
  return crypto.randomUUID();
}

async function readStore(): Promise<AdminStore> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw) as AdminStore;
  } catch {
    return structuredClone(DEFAULT_STORE);
  }
}

async function writeStore(store: AdminStore): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  if (isMongoConfigured()) {
    return getServiceCategoriesMongo();
  }

  const store = await readStore();
  return store.serviceCategories.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getServices(): Promise<Service[]> {
  if (isMongoConfigured()) {
    const services = await getServicesMongo();
    return services.map((service) => normalizeService(service));
  }

  const store = await readStore();
  return store.services
    .map((service) => normalizeService(service))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function getServiceById(id: string): Promise<Service | null> {
  if (isMongoConfigured()) {
    const service = await getServiceByIdMongo(id);
    return service ? normalizeService(service) : null;
  }

  const store = await readStore();
  const service = store.services.find((item) => item.id === id);
  return service ? normalizeService(service) : null;
}

export async function getServiceCategoryBySlug(
  slug: string,
): Promise<ServiceCategory | null> {
  if (isMongoConfigured()) {
    return getServiceCategoryBySlugMongo(slug);
  }

  const store = await readStore();
  return store.serviceCategories.find((category) => category.slug === slug) ?? null;
}

export async function getServicesByCategoryId(
  categoryId: string,
): Promise<Service[]> {
  if (isMongoConfigured()) {
    const services = await getServicesByCategoryMongo(categoryId);
    return services.map((service) => normalizeService(service));
  }

  const store = await readStore();
  return store.services
    .filter((service) => service.categoryId === categoryId)
    .map((service) => normalizeService(service))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function getFormSubmissions(): Promise<FormSubmission[]> {
  if (isMongoConfigured()) {
    return getFormSubmissionsMongo();
  }

  const store = await readStore();
  return store.formSubmissions
    .map((submission) => normalizeFormSubmission(submission))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export async function createServiceCategory(input: {
  name: string;
  description?: string;
}): Promise<ServiceCategory> {
  const category: ServiceCategory = {
    id: createId(),
    name: input.name.trim(),
    slug: slugify(input.name),
    description: input.description?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  if (isMongoConfigured()) {
    await insertServiceCategoryMongo(category);
  }

  const store = await readStore();
  store.serviceCategories.push(category);
  await writeStore(store);
  return category;
}

export async function deleteServiceCategory(id: string): Promise<void> {
  if (isMongoConfigured()) {
    await deleteServicesByCategoryMongo(id);
    await deleteServiceCategoryMongo(id);
  }

  const store = await readStore();
  store.serviceCategories = store.serviceCategories.filter(
    (category) => category.id !== id,
  );
  store.services = store.services.filter((service) => service.categoryId !== id);
  await writeStore(store);
}

export async function createService(input: ServiceInput): Promise<Service> {
  const categoryId = input.categoryId?.trim() || undefined;

  if (categoryId) {
    let categoryExists = false;

    if (isMongoConfigured()) {
      categoryExists = Boolean(await getServiceCategoryMongo(categoryId));
    } else {
      const store = await readStore();
      categoryExists = store.serviceCategories.some(
        (category) => category.id === categoryId,
      );
    }

    if (!categoryExists) {
      throw new Error("Selected category does not exist.");
    }
  }

  const now = new Date().toISOString();
  const service: Service = {
    id: createId(),
    categoryId,
    title: input.title.trim(),
    slug: slugify(input.title),
    tagline: input.tagline.trim(),
    summary: input.summary.trim() || input.tagline.trim(),
    heroImageUrl: input.heroImageUrl?.trim() || undefined,
    overview: input.overview.trim(),
    featureSections: input.featureSections,
    specifications: input.specifications,
    advantageTitle: input.advantageTitle.trim(),
    advantageContent: input.advantageContent.trim(),
    closingTitle: input.closingTitle.trim(),
    closingDescription: input.closingDescription.trim(),
    createdAt: now,
    updatedAt: now,
  };

  if (isMongoConfigured()) {
    await insertServiceMongo(service);
  }

  const store = await readStore();
  store.services.push(service);
  await writeStore(store);
  return service;
}

export async function updateService(
  id: string,
  input: ServiceInput,
): Promise<Service | null> {
  const existing = await getServiceById(id);

  if (!existing) {
    return null;
  }

  const categoryId = input.categoryId?.trim() || undefined;

  if (categoryId) {
    let categoryExists = false;

    if (isMongoConfigured()) {
      categoryExists = Boolean(await getServiceCategoryMongo(categoryId));
    } else {
      const store = await readStore();
      categoryExists = store.serviceCategories.some(
        (category) => category.id === categoryId,
      );
    }

    if (!categoryExists) {
      throw new Error("Selected category does not exist.");
    }
  }

  const service: Service = {
    ...existing,
    categoryId,
    title: input.title.trim(),
    slug: slugify(input.title),
    tagline: input.tagline.trim(),
    summary: input.summary.trim() || input.tagline.trim(),
    heroImageUrl: input.heroImageUrl?.trim() || undefined,
    overview: input.overview.trim(),
    featureSections: input.featureSections,
    specifications: input.specifications,
    advantageTitle: input.advantageTitle.trim(),
    advantageContent: input.advantageContent.trim(),
    closingTitle: input.closingTitle.trim(),
    closingDescription: input.closingDescription.trim(),
    updatedAt: new Date().toISOString(),
  };

  if (isMongoConfigured()) {
    await updateServiceMongo(service);
  }

  const store = await readStore();
  const index = store.services.findIndex((item) => item.id === id);

  if (index >= 0) {
    store.services[index] = service;
    await writeStore(store);
  }

  return service;
}

export async function deleteService(id: string): Promise<void> {
  if (isMongoConfigured()) {
    await deleteServiceMongo(id);
  }

  const store = await readStore();
  store.services = store.services.filter((service) => service.id !== id);
  await writeStore(store);
}

export async function createFormSubmission(input: {
  formName: string;
  sourcePage: string;
  sourcePath: string;
  firstName: string;
  organization?: string;
  phone: string;
  email: string;
  requirementType?: string;
  message?: string;
  extraFields?: Record<string, string>;
}): Promise<FormSubmission> {
  const submission: FormSubmission = {
    id: createId(),
    formName: input.formName.trim(),
    sourcePage: input.sourcePage.trim(),
    sourcePath: input.sourcePath.trim(),
    firstName: input.firstName.trim(),
    organization: input.organization?.trim() || undefined,
    phone: input.phone.trim(),
    email: input.email.trim(),
    requirementType: input.requirementType?.trim() || undefined,
    message: input.message?.trim() || undefined,
    extraFields: input.extraFields,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  if (isMongoConfigured()) {
    await insertFormSubmissionMongo(submission);
  }

  const store = await readStore();
  store.formSubmissions.unshift(submission);
  await writeStore(store);

  return submission;
}

export async function markFormSubmissionRead(id: string): Promise<void> {
  if (isMongoConfigured()) {
    await markFormSubmissionReadMongo(id);
  }

  const store = await readStore();
  const submission = store.formSubmissions.find((item) => item.id === id);

  if (submission) {
    submission.status = "read";
    await writeStore(store);
  }
}

export async function deleteFormSubmission(id: string): Promise<void> {
  if (isMongoConfigured()) {
    await deleteFormSubmissionMongo(id);
  }

  const store = await readStore();
  store.formSubmissions = store.formSubmissions.filter(
    (submission) => submission.id !== id,
  );
  await writeStore(store);
}
