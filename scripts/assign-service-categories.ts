/**
 * Assign existing instruments to their product categories.
 * Run: set -a && source .env.local && set +a && npx tsx scripts/assign-service-categories.ts
 */
import { readFileSync } from "fs";
import { MongoClient } from "mongodb";
import path from "path";

function loadEnvLocal() {
  try {
    const raw = readFileSync(path.join(process.cwd(), ".env.local"), "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // ignore
  }
}

loadEnvLocal();

const SERVICE_CATEGORY_BY_SLUG: Record<string, string> = {
  "hemoscan-3000-fully-automated-3-part-hematology-analyzer": "hematology",
  "hemoscan-5000-fully-automated-5-part-hematology-analyzer": "hematology",
  "chemoscan-semi-automated-clinical-biochemistry-analyzer": "biochemistry",
};

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "krm";

  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const categories = await db
    .collection("service_categories")
    .find({})
    .toArray();
  const categoryIdBySlug = new Map(
    categories.map((category) => [
      category.slug as string,
      category.id as string,
    ]),
  );

  for (const [serviceSlug, categorySlug] of Object.entries(
    SERVICE_CATEGORY_BY_SLUG,
  )) {
    const categoryId = categoryIdBySlug.get(categorySlug);
    if (!categoryId) {
      console.warn(`Missing category: ${categorySlug}`);
      continue;
    }

    const result = await db.collection("services").updateOne(
      { slug: serviceSlug },
      { $set: { categoryId, updatedAt: new Date().toISOString() } },
    );

    console.log(
      `${serviceSlug} → ${categorySlug}: matched=${result.matchedCount} modified=${result.modifiedCount}`,
    );
  }

  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
