/**
 * Seed static category landing content into Mongo so it is admin-editable.
 * Run: npx tsx scripts/seed-category-landings.ts
 */
import { readFileSync } from "fs";
import { MongoClient } from "mongodb";
import path from "path";
import { getAllStaticCategoryLandings } from "../lib/category-landing-resolve";

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

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "krm";

  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const landings = getAllStaticCategoryLandings();

  for (const landing of landings) {
    const result = await db.collection("service_categories").updateOne(
      { slug: landing.slug },
      {
        $set: {
          landing: {
            title: landing.title,
            tagline: landing.tagline,
            sections: landing.sections,
          },
          updatedAt: new Date().toISOString(),
        },
      },
    );

    console.log(
      `${landing.slug}: matched=${result.matchedCount} modified=${result.modifiedCount}`,
    );
  }

  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
