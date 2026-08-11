import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getMongoDb, isMongoConfigured } from "@/lib/mongodb";

const STORE_PATH = path.join(process.cwd(), "data", "admin-store.json");
const COLLECTION = "site_resources";
const DOCUMENT_KEY = "home";

export type SiteResourceLink = {
  id: string;
  title: string;
  href: string;
  fileUrl?: string;
};

export type SiteResources = {
  title: string;
  imageUrl?: string;
  links: SiteResourceLink[];
};

type SiteResourcesDocument = SiteResources & {
  _id?: string;
  key: string;
};

function createId(): string {
  return crypto.randomUUID();
}

export function getDefaultSiteResources(): SiteResources {
  return {
    title: "Resources & Downloads",
    imageUrl: undefined,
    links: [
      {
        id: "default-brochures",
        title: "Product Brochures",
        href: "/brochures",
      },
      {
        id: "default-certifications",
        title: "ISO & CE Certifications",
        href: "/certifications",
      },
      {
        id: "default-faqs",
        title: "FAQs",
        href: "/faqs",
      },
      {
        id: "default-blogs",
        title: "Blogs",
        href: "/blogs",
      },
    ],
  };
}

export function normalizeSiteResources(
  value: Partial<SiteResources> | null | undefined,
): SiteResources {
  const defaults = getDefaultSiteResources();

  if (!value) {
    return defaults;
  }

  const links = Array.isArray(value.links)
    ? value.links
        .filter((link) => link?.title?.trim())
        .map((link) => {
          const title = link.title.trim();
          const normalized = title.toLowerCase();
          const isFaqs = normalized === "faqs";
          const isCertifications =
            normalized === "iso & ce certifications" ||
            normalized.includes("certification");
          const isBrochures =
            normalized === "product brochures" ||
            normalized.includes("brochure");
          return {
            id: link.id || createId(),
            title,
            href: isFaqs
              ? "/faqs"
              : isCertifications
                ? "/certifications"
                : isBrochures
                  ? "/brochures"
                  : link.href?.trim() || "#",
            fileUrl: link.fileUrl?.trim() || undefined,
          };
        })
    : defaults.links;

  return {
    title: value.title?.trim() || defaults.title,
    imageUrl: value.imageUrl?.trim() || undefined,
    links: links.length > 0 ? links : defaults.links,
  };
}

async function readFromJson(): Promise<SiteResources | null> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    const store = JSON.parse(raw) as { siteResources?: SiteResources };
    return store.siteResources ?? null;
  } catch {
    return null;
  }
}

async function writeToJson(resources: SiteResources): Promise<void> {
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

  store.siteResources = resources;
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

async function getFromMongo(): Promise<SiteResources | null> {
  if (!isMongoConfigured()) {
    return null;
  }

  const db = await getMongoDb();
  const document = await db
    .collection<SiteResourcesDocument>(COLLECTION)
    .findOne({ key: DOCUMENT_KEY });

  if (!document) {
    return null;
  }

  const { _id, key, ...resources } = document;
  return resources;
}

async function saveToMongo(resources: SiteResources): Promise<void> {
  if (!isMongoConfigured()) {
    return;
  }

  const db = await getMongoDb();
  await db.collection<SiteResourcesDocument>(COLLECTION).replaceOne(
    { key: DOCUMENT_KEY },
    { key: DOCUMENT_KEY, ...resources },
    { upsert: true },
  );
}

export async function getSiteResources(): Promise<SiteResources> {
  if (isMongoConfigured()) {
    const mongoResources = await getFromMongo();
    if (mongoResources) {
      return normalizeSiteResources(mongoResources);
    }
  }

  const jsonResources = await readFromJson();
  return normalizeSiteResources(jsonResources);
}

export async function saveSiteResources(
  input: SiteResources,
): Promise<SiteResources> {
  const resources = normalizeSiteResources(input);

  if (isMongoConfigured()) {
    await saveToMongo(resources);
    return resources;
  }

  await writeToJson(resources);
  return resources;
}
