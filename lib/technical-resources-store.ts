import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getMongoDb, isMongoConfigured } from "@/lib/mongodb";

const STORE_PATH = path.join(process.cwd(), "data", "admin-store.json");
const COLLECTION = "site_technical_resources";
const DOCUMENT_KEY = "services";

export type TechnicalResourceItem = {
  id: string;
  title: string;
  content: string;
  fileUrl?: string;
};

export type TechnicalResources = {
  items: TechnicalResourceItem[];
};

type TechnicalResourcesDocument = TechnicalResources & {
  _id?: string;
  key: string;
};

function createId(): string {
  return crypto.randomUUID();
}

export const DEFAULT_TECHNICAL_RESOURCE_TITLES = [
  "Product Brochure",
  "Reagent Sheet",
  "Technical Specifications",
] as const;

export function getDefaultTechnicalResources(): TechnicalResources {
  return {
    items: DEFAULT_TECHNICAL_RESOURCE_TITLES.map((title, index) => ({
      id: `technical-resource-${index + 1}`,
      title,
      content: "",
      fileUrl: undefined,
    })),
  };
}

export function normalizeTechnicalResources(
  value: Partial<TechnicalResources> | null | undefined,
): TechnicalResources {
  const defaults = getDefaultTechnicalResources();

  if (!value || !Array.isArray(value.items) || value.items.length === 0) {
    return defaults;
  }

  const items = defaults.items.map((fallback, index) => {
    const incoming = value.items?.[index];

    return {
      id: incoming?.id?.trim() || fallback.id || createId(),
      title: incoming?.title?.trim() || fallback.title,
      content: incoming?.content?.trim() || "",
      fileUrl: incoming?.fileUrl?.trim() || undefined,
    };
  });

  return { items };
}

async function readFromJson(): Promise<TechnicalResources | null> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    const store = JSON.parse(raw) as {
      technicalResources?: TechnicalResources;
    };
    return store.technicalResources ?? null;
  } catch {
    return null;
  }
}

async function writeToJson(resources: TechnicalResources): Promise<void> {
  let store: Record<string, unknown> = {};

  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    store = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    store = {
      serviceCategories: [],
      services: [],
      formSubmissions: [],
    };
  }

  store.technicalResources = resources;
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

async function getFromMongo(): Promise<TechnicalResources | null> {
  if (!isMongoConfigured()) {
    return null;
  }

  const db = await getMongoDb();
  const document = await db
    .collection<TechnicalResourcesDocument>(COLLECTION)
    .findOne({ key: DOCUMENT_KEY });

  if (!document) {
    return null;
  }

  const { _id, key, ...resources } = document;
  return resources;
}

async function saveToMongo(resources: TechnicalResources): Promise<void> {
  if (!isMongoConfigured()) {
    return;
  }

  const db = await getMongoDb();
  await db.collection<TechnicalResourcesDocument>(COLLECTION).replaceOne(
    { key: DOCUMENT_KEY },
    { key: DOCUMENT_KEY, ...resources },
    { upsert: true },
  );
}

export async function getTechnicalResources(): Promise<TechnicalResources> {
  if (isMongoConfigured()) {
    const mongoResources = await getFromMongo();
    if (mongoResources) {
      return normalizeTechnicalResources(mongoResources);
    }
  }

  const jsonResources = await readFromJson();
  return normalizeTechnicalResources(jsonResources);
}

export async function saveTechnicalResources(
  input: TechnicalResources,
): Promise<TechnicalResources> {
  const resources = normalizeTechnicalResources(input);

  if (isMongoConfigured()) {
    await saveToMongo(resources);
    return resources;
  }

  await writeToJson(resources);
  return resources;
}
