import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getMongoDb, isMongoConfigured } from "@/lib/mongodb";

const STORE_PATH = path.join(process.cwd(), "data", "admin-store.json");
const COLLECTION = "site_certifications";
const DOCUMENT_KEY = "home";

export type SiteCertificationItem = {
  id: string;
  cardTitle: string;
  cardDescription: string;
  imageUrl?: string;
  fileUrl?: string;
};

export type SiteCertifications = {
  title: string;
  items: SiteCertificationItem[];
};

type LegacySiteCertifications = {
  title?: string;
  cardTitle?: string;
  cardDescription?: string;
  imageUrl?: string;
  fileUrl?: string;
  items?: SiteCertificationItem[];
};

type SiteCertificationsDocument = SiteCertifications & {
  _id?: string;
  key: string;
};

function createId(): string {
  return crypto.randomUUID();
}

export function getDefaultCertificationItem(): SiteCertificationItem {
  return {
    id: "default-iso-ce",
    cardTitle: "ISO & CE Standards",
    cardDescription:
      "Products are manufactured following international quality standards.",
    imageUrl: undefined,
    fileUrl: undefined,
  };
}

export function getDefaultSiteCertifications(): SiteCertifications {
  return {
    title: "Trust & Certifications",
    items: [getDefaultCertificationItem()],
  };
}

function normalizeItem(
  item: Partial<SiteCertificationItem> | null | undefined,
): SiteCertificationItem | null {
  if (!item?.cardTitle?.trim()) {
    return null;
  }

  return {
    id: item.id || createId(),
    cardTitle: item.cardTitle.trim(),
    cardDescription: item.cardDescription?.trim() || "",
    imageUrl: item.imageUrl?.trim() || undefined,
    fileUrl: item.fileUrl?.trim() || undefined,
  };
}

export function normalizeSiteCertifications(
  value: LegacySiteCertifications | null | undefined,
): SiteCertifications {
  const defaults = getDefaultSiteCertifications();

  if (!value) {
    return defaults;
  }

  let items: SiteCertificationItem[] = [];

  if (Array.isArray(value.items) && value.items.length > 0) {
    items = value.items
      .map((item) => normalizeItem(item))
      .filter((item): item is SiteCertificationItem => Boolean(item));
  } else if (value.cardTitle?.trim()) {
    const legacy = normalizeItem({
      id: "legacy-certification",
      cardTitle: value.cardTitle,
      cardDescription: value.cardDescription,
      imageUrl: value.imageUrl,
      fileUrl: value.fileUrl,
    });
    if (legacy) {
      items = [legacy];
    }
  }

  return {
    title: value.title?.trim() || defaults.title,
    items: items.length > 0 ? items : defaults.items,
  };
}

async function readFromJson(): Promise<LegacySiteCertifications | null> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    const store = JSON.parse(raw) as {
      siteCertifications?: LegacySiteCertifications;
    };
    return store.siteCertifications ?? null;
  } catch {
    return null;
  }
}

async function writeToJson(certifications: SiteCertifications): Promise<void> {
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

  store.siteCertifications = certifications;
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

async function getFromMongo(): Promise<LegacySiteCertifications | null> {
  if (!isMongoConfigured()) {
    return null;
  }

  const db = await getMongoDb();
  const document = await db
    .collection<SiteCertificationsDocument & LegacySiteCertifications>(
      COLLECTION,
    )
    .findOne({ key: DOCUMENT_KEY });

  if (!document) {
    return null;
  }

  const { _id, key, ...certifications } = document;
  return certifications;
}

async function saveToMongo(certifications: SiteCertifications): Promise<void> {
  if (!isMongoConfigured()) {
    return;
  }

  const db = await getMongoDb();
  await db.collection(COLLECTION).replaceOne(
    { key: DOCUMENT_KEY },
    { key: DOCUMENT_KEY, ...certifications },
    { upsert: true },
  );
}

export async function getSiteCertifications(): Promise<SiteCertifications> {
  if (isMongoConfigured()) {
    const mongoValue = await getFromMongo();
    if (mongoValue) {
      return normalizeSiteCertifications(mongoValue);
    }
  }

  const jsonValue = await readFromJson();
  return normalizeSiteCertifications(jsonValue);
}

export async function saveSiteCertifications(
  input: SiteCertifications,
): Promise<SiteCertifications> {
  const certifications = normalizeSiteCertifications(input);

  if (isMongoConfigured()) {
    await saveToMongo(certifications);
    return certifications;
  }

  await writeToJson(certifications);
  return certifications;
}
