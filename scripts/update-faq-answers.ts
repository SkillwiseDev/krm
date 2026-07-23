/**
 * Attach FAQ answers for HemoScan 3000 and ChemoScan.
 * Run: npx tsx scripts/update-faq-answers.ts
 */
import crypto from "crypto";
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

function faq(question: string, answer: string) {
  return { id: crypto.randomUUID(), question, answer };
}

const FAQ_UPDATES: Record<
  string,
  { id: string; question: string; answer: string }[]
> = {
  "hemoscan-3000-fully-automated-3-part-hematology-analyzer": [
    faq(
      "What is the primary focus and target lab size for the HemoScan 3000?",
      "The HemoScan 3000 is an automated 3-part hematology analyzer specifically engineered for small to medium-sized pathology laboratories, clinics, and diagnostic centers. It provides a compact, cost-effective solution without compromising testing accuracy or operational speed.",
    ),
    faq(
      "How does the HemoScan 3000 help reduce total operational and reagent costs?",
      "At KRM Healthcare, our value proposition centers on delivering Global Equipment Quality at Local Prices. The HemoScan 3000 is designed for low reagent consumption per test and pairs seamlessly with KRM’s high-quality, locally manufactured reagents (diluent, lyse, and cleaner). This eliminates high import markups and ensures predictable, low per-test costs.",
    ),
    faq(
      "What kind of support and reagent availability can lab owners expect after purchasing?",
      "To address common market supply chain disruptions, KRM Healthcare guarantees a reliable supply of compatible reagents with rapid delivery turnaround times (2 to 7 days). Furthermore, our dedicated customer care and regional distributor network provide real-time, day-to-day troubleshooting and technical assistance to keep your lab fully operational.",
    ),
    faq(
      "Is the HemoScan 3000 easy to integrate into existing Laboratory Information Systems (LIS)?",
      "Yes. The analyzer features standard connectivity interfaces (USB/Ethernet ports) to enable smooth data transmission to your LIS. This minimizes manual data entry errors, simplifies patient record management, and speeds up result reporting.",
    ),
    faq(
      "Can we request a demonstration or test kit before finalizing our procurement?",
      "Absolutely. We understand that quality and reliability are non-negotiable for pathologists. You can contact our customer care team or submit a request on our website to schedule a product demonstration or request reagent validation kits tailored to your lab setup.",
    ),
  ],
  "chemoscan-semi-automated-clinical-biochemistry-analyzer": [
    faq(
      "What type of tests can be performed on the Chemoscan system, and what is its assay menu?",
      "Chemoscan is a high-precision clinical chemistry system designed to support a comprehensive suite of routine and specialized biochemical assays.\n\nIts assay capabilities include:\nRoutine Clinical Chemistry: Glucose, Urea, Creatinine, Liver & Kidney Function Panels, Total Protein, Albumin, Calcium, Phosphorous, and Electrolytes.\nSpecial Profiles & Immuno-assays: ADA (Adenosine Deaminase), Homocysteine, HbA1c/Fructosamine, Lipid Profiles, and specific quantitative markers.\nImmunoturbidimetry: CRP, Hs-CRP, ASO, RF, and Microalbumin.",
    ),
    faq(
      "How does Chemoscan ensure accuracy and repeatability in high-throughput testing?",
      "Chemoscan features an advanced, stable photometric optical system and precision liquid-handling technology. It integrates automated calibration, blanking, and real-time Quality Control (QC) monitoring to eliminate manual operator error and ensure consistent, accurate results for every sample batch.",
    ),
    faq(
      "Is Chemoscan compatible with third-party reagents, or does KRM Healthcare provide optimized reagents?",
      "While Chemoscan utilizes an open/adaptable system architecture, it delivers maximum accuracy, linear stability, and cost-efficiency when paired with KRM Healthcare’s dedicated reagent lines. KRM Healthcare manufactures premium, locally priced reagents designed specifically to reduce per-test costs while maintaining international quality benchmarks.",
    ),
    faq(
      "Can Chemoscan seamlessly integrate with our existing Pathology Laboratory Information System (LIS)?",
      "Yes. Chemoscan is equipped with built-in data connectivity options (including USB, RS232, and Ethernet capabilities supporting LIS/HL7 protocols). This allows direct bidirectional or uni-directional communication with your laboratory software, streamlining report generation and eliminating manual data-entry errors.",
    ),
    faq(
      "What post-installation support and warranty does KRM Healthcare provide for Chemoscan?",
      "KRM Healthcare directly addresses operational downtime by providing real-time local support and predictable supply chains. Every Chemoscan unit includes:\nOn-site installation and comprehensive operator training for lab technicians.\nDedicated application support and rapid engineering service dispatch.\nReliable, uninterrupted supply of matching reagents directly through our regional dealer/distributor network.",
    ),
  ],
};

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "krm";

  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  const client = new MongoClient(uri);
  await client.connect();
  const collection = client.db(dbName).collection("services");

  for (const [slug, faqs] of Object.entries(FAQ_UPDATES)) {
    const result = await collection.updateOne(
      { slug },
      {
        $set: {
          faqs,
          updatedAt: new Date().toISOString(),
        },
      },
    );

    console.log(
      `${slug}: matched=${result.matchedCount} modified=${result.modifiedCount}`,
    );
  }

  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
