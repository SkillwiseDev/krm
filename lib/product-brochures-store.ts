import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getMongoDb, isMongoConfigured } from "@/lib/mongodb";

const STORE_PATH = path.join(process.cwd(), "data", "admin-store.json");
const COLLECTION = "site_product_brochures";
const DOCUMENT_KEY = "home";

export type ProductBrochureItem = {
  id: string;
  title: string;
  fileUrl?: string;
};

export type ProductBrochures = {
  title: string;
  items: ProductBrochureItem[];
};

type ProductBrochuresDocument = ProductBrochures & {
  _id?: string;
  key: string;
};

function createId(): string {
  return crypto.randomUUID();
}

export function getDefaultProductBrochures(): ProductBrochures {
  return {
    title: "Product Brochures",
    items: [],
  };
}

function normalizeItem(
  item: Partial<ProductBrochureItem> | null | undefined,
): ProductBrochureItem | null {
  if (!item?.title?.trim()) {
    return null;
  }

  return {
    id: item.id || createId(),
    title: item.title.trim(),
    fileUrl: item.fileUrl?.trim() || undefined,
  };
}

export function normalizeProductBrochures(
  value: Partial<ProductBrochures> | null | undefined,
): ProductBrochures {
  const defaults = getDefaultProductBrochures();

  if (!value) {
    return defaults;
  }

  const items = Array.isArray(value.items)
    ? value.items
        .map((item) => normalizeItem(item))
        .filter((item): item is ProductBrochureItem => Boolean(item))
    : [];

  return {
    title: value.title?.trim() || defaults.title,
    items,
  };
}

async function readFromJson(): Promise<ProductBrochures | null> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    const store = JSON.parse(raw) as {
      productBrochures?: ProductBrochures;
    };
    return store.productBrochures ?? null;
  } catch {
    return null;
  }
}

async function writeToJson(brochures: ProductBrochures): Promise<void> {
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

  store.productBrochures = brochures;
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

async function getFromMongo(): Promise<ProductBrochures | null> {
  if (!isMongoConfigured()) {
    return null;
  }

  const db = await getMongoDb();
  const document = await db
    .collection<ProductBrochuresDocument>(COLLECTION)
    .findOne({ key: DOCUMENT_KEY });

  if (!document) {
    return null;
  }

  const { _id, key, ...brochures } = document;
  return brochures;
}

async function saveToMongo(brochures: ProductBrochures): Promise<void> {
  if (!isMongoConfigured()) {
    return;
  }

  const db = await getMongoDb();
  await db.collection(COLLECTION).replaceOne(
    { key: DOCUMENT_KEY },
    { key: DOCUMENT_KEY, ...brochures },
    { upsert: true },
  );
}

export async function getProductBrochures(): Promise<ProductBrochures> {
  if (isMongoConfigured()) {
    const mongoValue = await getFromMongo();
    if (mongoValue) {
      return normalizeProductBrochures(mongoValue);
    }
  }

  const jsonValue = await readFromJson();
  return normalizeProductBrochures(jsonValue);
}

export async function saveProductBrochures(
  input: ProductBrochures,
): Promise<ProductBrochures> {
  const brochures = normalizeProductBrochures(input);

  if (isMongoConfigured()) {
    await saveToMongo(brochures);
    return brochures;
  }

  await writeToJson(brochures);
  return brochures;
}
