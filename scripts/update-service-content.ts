/**
 * Update HemoScan 3000, HemoScan 5000, and ChemoScan service content.
 * Run: npx tsx scripts/update-service-content.ts
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

function faq(question: string) {
  return { id: crypto.randomUUID(), question };
}

/**
 * Page mapping:
 * - section titles → Key Features (teal boxes)
 * - section items → Product Benefits list
 */
function buildFeatureSections(
  keyFeatures: string[],
  benefitItems: string[],
): { title: string; items: string[] }[] {
  return keyFeatures.map((title, index) => ({
    title,
    items: index === keyFeatures.length - 1 ? benefitItems : [],
  }));
}

const UPDATES: Record<
  string,
  {
    title: string;
    tagline: string;
    summary: string;
    overview: string;
    featureSections: { title: string; items: string[] }[];
    specifications: { label: string; detail: string }[];
    advantageTitle: string;
    advantageContent: string;
    closingTitle: string;
    closingDescription: string;
    faqs: { id: string; question: string }[];
  }
> = {
  "hemoscan-3000-fully-automated-3-part-hematology-analyzer": {
    title: "HemoScan 3000 – Fully Automated 3-Part Hematology Analyzer",
    tagline: "Global Equipment Quality at Local Prices",
    summary: "Global Equipment Quality at Local Prices",
    overview: [
      "The HemoScan 3000 is a compact, user-friendly, and highly efficient 3-part hematology analyzer designed to fulfill your everyday clinical needs. By combining classical electrical impedance measurement technology with advanced cyanide-free colorimetry, the system guarantees superior accuracy, complete biohazard safety, and maximum reliability.",
      "Engineered specifically to solve the high cost-per-test challenges faced by diagnostic environments, the HemoScan 3000 brings high-throughput automation within economic reach—delivering a perfect price-to-value fit for modern pathology labs.",
    ].join("\n\n"),
    featureSections: buildFeatureSections(
      [
        "60 samples per hour automated throughput",
        "10.4-inch intuitive color touch screen",
        "29 measurement parameters provided",
        "50,000-result memory data storage",
        "20 microliter blood sample volume requirement",
      ],
      [
        "60 Samples/Hour: Process up to 60 samples per hour, giving your laboratory a competitive edge with rapid one-minute waiting times per result.",
        "One-Click Workflows: Minimize operational bottlenecks with simple one-click testing and smart one-click troubleshooting features.",
        "Detailed Warning System: Built-in advanced software flags abnormal cell results, providing clear, actionable warnings to clinicians.",
        "Comprehensive Quality Control: Safeguard integrity using dedicated, original barcoded reagents, alongside comprehensive QC programs and fully automatic calibration.",
        "Ultra-Low Sample Volume: Requires just 9μL of whole blood per test. This minimal draw eliminates redraws and makes the analyzer ideal for pediatric testing.",
        "Minimized Upkeep: The automated cleaning system reduces human intervention, ensuring the long-life hardware components stay operational without regular, manual maintenance expenses.",
        "Lean Reagent Footprint: Operates on only two operational reagents and a probe cleaner, drastically lowering overhead logistics costs.",
        "Massive Storage Capability: Securely holds up to 50,000 complete patient profiles—including both numerical data and clear visual graphical histograms.",
        "Seamless LIS Integration: Equipped with a built-in LAN port supporting standard HL7 protocols, seamlessly syncing data directly to your Laboratory Information System (LIS).",
      ],
    ),
    specifications: [
      {
        label: "Analyzer Type",
        detail: "3-Part Differential",
      },
      {
        label: "System Operation",
        detail: "Fully Automatic",
      },
      {
        label: "Measurement Principles",
        detail:
          "Electrical impedance for WBC, RBC, and PLT counting; Cyanide-free colorimetry for HGB test",
      },
      {
        label: "Parameters & Outputs",
        detail:
          "21 Parameters: WBC, Lymph#, Mid#, Gran#, Lymph%, Mid%, Gran%, RBC, HGB, HCT, MCV, MCH, MCHC, RDW-CV, RDW-SD, PLT, MPV, PDW, PCT, P-LCR, P-LCC\n• 3 Histograms: RBC, WBC, and PLT",
      },
      {
        label: "Throughput Capacity",
        detail: "Up to 60 samples per hour",
      },
      {
        label: "Sample Modes",
        detail: "Whole blood, Capillary whole blood mode, Prediluted mode",
      },
      {
        label: "Sample Volume",
        detail: "9 μL whole blood",
      },
      {
        label: "Display Panel",
        detail: "10.4-inch high-resolution color TFT touch screen",
      },
      {
        label: "Data Storage",
        detail:
          "Up to 50,000 sample results including numeric and graphical histogram info",
      },
      {
        label: "External Interfaces",
        detail:
          "4 x USB ports, 1 x Ethernet (LAN) port (Supports HL7 protocol & LIS)\n• Supports external printer, keyboard, mouse, and barcode scanner",
      },
      {
        label: "Built-in Printer",
        detail: "Onboard thermal printer; customizable printing formats",
      },
      {
        label: "Operating Environment",
        detail:
          "Temperature: 15°C ~ 30°C; Humidity: 20% ~ 85%; Air Pressure: 70 kPa ~ 106 kPa",
      },
      {
        label: "Dimensions & Weight",
        detail:
          "270 mm (W) x 470 mm (H) x 420 mm (D); Net Weight: 20 kg",
      },
    ],
    advantageTitle: "The KRM Healthcare Advantage",
    advantageContent:
      "At KRM Healthcare, we realise that IVD hardware is a critical pillar of your clinical outcomes and daily business efficiency. Manufactured in our state-of-the-art facility at the Medical Device Park in Ujjain, the HemoScan 3000 is fully backed by our ISO 13485 quality management systems. We insulate your laboratory operations from volatile market swings by guaranteeing real-time technical resolution and an uninterrupted supply of high-grade, original consumables.",
    closingTitle: "Optimize Your Diagnostics Portfolio Today",
    closingDescription:
      "Partner with an industry leader focused on bringing local value chains to global standards.",
    faqs: [
      faq(
        "What is the primary focus and target lab size for the HemoScan 3000?",
      ),
      faq(
        "How does the HemoScan 3000 help reduce total operational and reagent costs?",
      ),
      faq(
        "What kind of support and reagent availability can lab owners expect after purchasing?",
      ),
      faq(
        "Is the HemoScan 3000 easy to integrate into existing Laboratory Information Systems (LIS)?",
      ),
      faq(
        "Can we request a demonstration or test kit before finalizing our procurement?",
      ),
    ],
  },

  "hemoscan-5000-fully-automated-5-part-hematology-analyzer": {
    title: "HemoScan 5000 – Fully Automated 5-Part Hematology Analyzer",
    tagline: "Global Equipment Quality at Local Prices",
    summary: "Global Equipment Quality at Local Prices",
    overview: [
      "Step up to premium, high-tier diagnostic efficiency with the HemoScan 5000, our premier fully automated 5-part hematology analyzer. Engineered specifically for advanced labs, tier-1 hospitals, and high-volume diagnostic franchises, this flagship system delivers deep cellular differentiation by using laser scatter and chemical dye technologies alongside traditional electrical impedance.",
      "The HemoScan 5000 directly solves the common trade-offs between soaring premium reagent costs and data precision. It delivers an uncompromised price-to-value fit, ensuring your laboratory can provide complete white blood cell differentials quickly, accurately, and at local price points.",
    ].join("\n\n"),
    featureSections: buildFeatureSections(
      [
        "5-part analyzer: Automatic hematology system",
        "Touchscreen: 10.4-inch color touch display",
        "29 parameters: Includes 4 scattergrams",
        "Flow cytometry: Laser scatter WBC differential",
        "Large memory: Stores up to 50,000 results",
      ],
      [
        "High throughput: Test up to 60 samples/hr",
        "Space-saving: Compact design saves lab space",
        "Easy operation: Single-button analysis system",
        "Global quality: High accuracy at local price",
        "Low maintenance: Built-in smart maintenance system",
        "True Differential Analysis: Provides an exhaustive breakdown of WBCs (Neutrophils, Lymphocytes, Monocytes, Eosinophils, and Basophils) to isolate complex clinical conditions faster.",
        "Laser Scatter Technology: Uses precise optical channels to map cell complexity and size, significantly reducing manual slide review rates.",
        "Accelerated Lab Workflows: Seamlessly processes high daily sample loads with an optimized throughput of up to 60 samples per hour, giving busy diagnostics teams true walk-away efficiency.",
        "Autoloader Ready Capability: Designed to support continuous sample rack loading, eliminating sample-by-sample manual interventions.",
        "Ultra-Efficient Aspiration Volume: Requires an exceptionally low whole blood volume sample, preserving precious capillary samples and serving as an ideal asset for pediatric and geriatric testing.",
        "Targeted Reagent Footprint: Utilizes advanced original barcoded reagents optimized to deliver absolute testing stability and protect against market supply fluctuations.",
        "Expanded Data Vault: Massive internal database captures and protects complete patient result histories, mapping full 5-part scattergrams and traditional histograms.",
        "Bi-Directional LIS Networking: Syncs effortlessly with your existing Laboratory Information System (LIS) via standard HL7 protocols, eliminating transcription errors.",
      ],
    ),
    specifications: [
      {
        label: "Measurement Principles",
        detail:
          "• Semiconductor Laser Scatter combined with chemical dye method for 5-part WBC differential analysis\n• Electrical impedance for WBC, RBC, and PLT counting\n• Cyanide-free colorimetry for HGB testing",
      },
      {
        label: "Parameters & Analysis",
        detail:
          "• 25+ Reportable Parameters: WBC, LYM#, MON#, NEU#, EOS#, BAS#, LYM%, MON%, NEU%, EOS%, BAS%, RBC, HGB, HCT, MCV, MCH, MCHC, RDW-CV, RDW-SD, PLT, MPV, PDW, PCT, P-LCR, P-LCC\n• Graphic Outputs: 3D or 2D Scattergrams for WBC plus 3 Histograms (WBC, RBC, PLT)",
      },
      {
        label: "Throughput Capacity",
        detail: "Up to 60 samples per hour",
      },
      {
        label: "Sample Aspiration Modes",
        detail:
          "Whole blood (open/closed vial), Capillary whole blood, and Prediluted modes",
      },
      {
        label: "Display Panel",
        detail:
          "Large high-definition interactive color TFT touch screen supporting real-time graphical software",
      },
      {
        label: "Interface & Data Ports",
        detail:
          "Multiple USB ports and LAN/Ethernet ports supporting bi-directional HL7 LIS integration",
      },
      {
        label: "Data Storage Capability",
        detail:
          "Up to 50,000+ patient test profiles including exhaustive graphical scattergrams and numeric records",
      },
      {
        label: "Quality Control Management",
        detail:
          "Comprehensive QC tracking charts (LJ and X-B modes) with fully automated calibration check paths",
      },
    ],
    advantageTitle: "The KRM Healthcare Advantage",
    advantageContent:
      "At KRM Healthcare, we believe that advanced 5-part diagnostics should not mean dealing with fragile international supply chains or inflated corporate markups. Manufactured strictly inside our world-class medical device infrastructure in Ujjain under rigid ISO 13485 compliance standards, the HemoScan 5000 is built for continuous, reliable operation. We insulate your lab from sudden market shifts by guaranteeing direct, local technical support and a constant, stable supply of premium original reagents.",
    closingTitle: "Command Your Advanced Diagnostics Market",
    closingDescription:
      "Equip your laboratory business with elite 5-part technology designed to maximize productivity and build clinical trust.",
    faqs: [],
  },

  "chemoscan-semi-automated-clinical-biochemistry-analyzer": {
    title: "ChemoScan – Semi-Automated Clinical Biochemistry Analyzer",
    tagline: "Global Equipment Quality at Local Prices",
    summary: "Global Equipment Quality at Local Prices",
    overview: [
      'The ChemoScan is a robust, high-precision, semi-automated biochemistry analyzer engineered to serve as the technological backbone of modern pathology labs. Designed with user-centric functionality and an integrated "Smart Calibration" system, it brings uncompromising analytical quality and economic viability together in one compact desktop solution.',
      "Whether you are launching a startup lab, extending a diagnostic franchise network, or resolving volatile workflow dependencies, ChemoScan delivers the flawless price-to-value fit your laboratory needs to scale confidently.",
    ].join("\n\n"),
    featureSections: buildFeatureSections(
      [
        "Expansive Testing Versatility",
        "The Smart Calibration Advantage",
        "Industrial Durability & Lowered Upkeep",
        "Seamless Operation & Interface",
        "Open-System Biochemistry Platform",
      ],
      [
        "Delivers Fast 60-Sample Hourly Output",
        "Requires Only 20 µL Sample Volume",
        "Maximizes Space with Compact Design",
        "Ensures Precise, High-Quality Results",
        "Streamlines Operations via Touch UI",
        "Direct Access Keypad: Accelerate daily workflow processing with direct access to more than 200 open tests through pre-configured, physical test keys.",
        "Multi-Mode Open Diagnostics: Accommodates a vast menu of 250 open tests spanning critical biochemistry profiles, turbidimetric assays, and fundamental coagulation testing (PT, INR, APTT).",
        "Cost-Effective Profiling: Featuring a dedicated, onboard Smart Calibration Facility optimized for low-friction, budget-conscious validation of high-demand markers: HbA1c, CRP, RF, and ASO.",
        "Advanced Analytics Data: Integrated with intelligent data tracking that maps online real-time curves, Levey-Jennings charts, and standard deviation graphs for rigid clinical compliance.",
        "Maintenance-Free Peristaltic Pump: Reduces moving hardware parts, ensuring a continuous sample fluid path without regular replacement overheads.",
        "Long-Life Circuitry: Features unique power management circuits dedicated to preserving lamp longevity, protecting against premature optical burnouts.",
        "Robust Electrical Shielding: Built with an internal stabilizer to insulate complex electronics from erratic line voltage fluctuations.",
        "Sample Carry-Over Prevention: Integrated rinse wash protocols eliminate inter-sample contamination, protecting test parameters from cross-contamination.",
        "Triple Cuvette Versatility: Features a flexible reading module accommodating an 18 μL flow cell, 10 mm square cuvettes, and round tubes for specialized coagulation workflows.",
        "User-Friendly Control Panel: Driven by a responsive 5-inch Color Graphics LCD touch panel backed by logical, intuitive laboratory software.",
      ],
    ),
    specifications: [
      {
        label: "Device Category",
        detail: "Clinical Chemistry",
      },
      {
        label: "Operation Type",
        detail: "Semi Automated",
      },
      {
        label: "Optical System",
        detail:
          "• Linear Range: 0.000 to 3.000 Absorbance Units (A)\n• Photometric Accuracy: ±2% or 0.007 (whichever is higher from 0 to 1.5 A), ±3% (from 1.5 A to 3.0 A)\n• Optical Measurement: Photo diode detector\n• Light Source: Long-life Tungsten halogen lamp",
      },
      {
        label: "Analysis Modes",
        detail:
          "Absorbance, End Point, Fixed Time, Kinetic, Differential, Ratio, and Coagulation (PT, INR, APTT)",
      },
      {
        label: "Wavelength Filters",
        detail:
          "Hard-coated narrow band interference filters: 340, 405, 510, 546, 578, 630 nm (plus 2 optional positions)",
      },
      {
        label: "Flow Cell & Cuvette System",
        detail:
          "• Sipping Volume: Configurable up to 1000 μL\n• Triple System: 18 μL flow cell, 10 mm square cuvette, and round tube",
      },
      {
        label: "Incubator",
        detail: "15 Onboard incubation positions regulated strictly at 37°C",
      },
      {
        label: "Memory Capacity",
        detail:
          "• Open Test Storage: Up to 250 test methods\n• Patient Memory: 2500 patient results\n• Quality Control: 30 QC results per individual test",
      },
      {
        label: "Human Machine Interface",
        detail:
          "5-inch Color Graphics LCD with an integrated touch panel and tactile keypad",
      },
      {
        label: "Onboard Output",
        detail: "Internal, maintenance-free 28-column thermal graphic printer",
      },
      {
        label: "Power Supply",
        detail: "Wattage: 100 VA; Voltage: 115–230 Volts ±10%, 50–62 Hz",
      },
      {
        label: "Enclosure & Dimension",
        detail:
          "• Enclosure: ABS fire retardant material\n• Storage Limits: Temperature -10 °C to +60°C; Humidity up to 85%\n• Dimensions: 380 mm (L) x 305 mm (W) x 175 mm (H)\n• Net Weight: ~5 kg",
      },
    ],
    advantageTitle: "The KRM Healthcare Advantage",
    advantageContent:
      "At KRM Healthcare, we remove the compromise between global reliability and structural affordability. Developed within our advanced manufacturing unit inside the Medical Device Park at Vikram Udyogpuri, Ujjain, the ChemoScan analyzer carries full ISO 13485 quality certification. By supplying both high-grade instruments and an extensive, locally produced line of open-system BioScan Liquid Reagents, we actively protect your laboratory against supply bottlenecks and unpredictable operational price hikes.",
    closingTitle: "Redefine Your Clinical Chemistry Line",
    closingDescription:
      "Equip your diagnostic business with tools engineered to lower the total cost per test while maximizing clinical data integrity.",
    faqs: [
      faq(
        "What type of tests can be performed on the Chemoscan system, and what is its assay menu?",
      ),
      faq(
        "How does Chemoscan ensure accuracy and repeatability in high-throughput testing?",
      ),
      faq(
        "Is Chemoscan compatible with third-party reagents, or does KRM Healthcare provide optimized reagents?",
      ),
      faq(
        "Can Chemoscan seamlessly integrate with our existing Pathology Laboratory Information System (LIS)?",
      ),
      faq(
        "What post-installation support and warranty does KRM Healthcare provide for Chemoscan?",
      ),
    ],
  },
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
  const collection = db.collection("services");

  const existing = await collection
    .find({})
    .project({ slug: 1, title: 1 })
    .toArray();
  console.log(
    "Existing services:",
    existing.map((s) => `${s.slug}`).join("\n") || "(none)",
  );

  for (const [slug, content] of Object.entries(UPDATES)) {
    const result = await collection.updateOne(
      { slug },
      {
        $set: {
          ...content,
          updatedAt: new Date().toISOString(),
        },
      },
    );

    console.log(
      `${slug}: matched=${result.matchedCount} modified=${result.modifiedCount}`,
    );

    if (result.matchedCount === 0) {
      console.warn(`  No service found for slug: ${slug}`);
    }
  }

  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
