import type {
  Service,
  ServiceApplication,
  ServiceDownload,
  ServiceFaq,
  ServiceFeatureSection,
  ServiceSpecification,
} from "@/lib/admin-store";
import { MAX_SERVICE_FAQS } from "@/lib/service-limits";

export type ServiceInput = {
  id?: string;
  categoryId?: string;
  title: string;
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
};

export function normalizeService(
  service: Partial<Service> & {
    id: string;
    title: string;
    slug: string;
    createdAt: string;
  },
): Service {
  return {
    id: service.id,
    categoryId: service.categoryId?.trim() || undefined,
    title: service.title,
    slug: service.slug,
    tagline: service.tagline ?? service.summary ?? "",
    summary: service.summary ?? service.tagline ?? "",
    heroImageUrl: service.heroImageUrl?.trim() || undefined,
    overview: service.overview ?? "",
    featureSections: service.featureSections ?? [],
    specifications: service.specifications ?? [],
    applications: normalizeApplications(service.applications),
    downloads: normalizeDownloads(service.downloads),
    faqsImageUrl: service.faqsImageUrl?.trim() || undefined,
    faqs: normalizeFaqs(service.faqs),
    advantageTitle: service.advantageTitle ?? "",
    advantageContent: service.advantageContent ?? "",
    closingTitle: service.closingTitle ?? "",
    closingDescription: service.closingDescription ?? "",
    createdAt: service.createdAt,
    updatedAt: service.updatedAt ?? service.createdAt,
  };
}

function normalizeApplications(
  applications: ServiceApplication[] | undefined,
): ServiceApplication[] {
  if (!applications?.length) {
    return [];
  }

  return applications
    .filter((application) => application.id && application.title?.trim())
    .map((application) => ({
      id: application.id,
      title: application.title.trim(),
      iconUrl: application.iconUrl?.trim() || undefined,
    }));
}

function normalizeDownloads(
  downloads: ServiceDownload[] | undefined,
): ServiceDownload[] {
  if (!downloads?.length) {
    return [];
  }

  return downloads
    .filter(
      (download) =>
        download.id && download.title?.trim() && download.fileUrl?.trim(),
    )
    .map((download) => ({
      id: download.id,
      title: download.title.trim(),
      fileUrl: download.fileUrl.trim(),
    }));
}

function normalizeFaqs(faqs: ServiceFaq[] | undefined): ServiceFaq[] {
  if (!faqs?.length) {
    return [];
  }

  return faqs
    .filter((faq) => faq.id && faq.question?.trim())
    .slice(0, MAX_SERVICE_FAQS)
    .map((faq) => ({
      id: faq.id,
      question: faq.question.trim(),
      answer: faq.answer?.trim() || undefined,
    }));
}

export function parseFeatureSections(value: FormDataEntryValue | null): ServiceFeatureSection[] {
  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as ServiceFeatureSection[];
    return parsed
      .filter((section) => section.title.trim())
      .map((section) => ({
        title: section.title.trim(),
        items: section.items.map((item) => item.trim()).filter(Boolean),
      }));
  } catch {
    return [];
  }
}

export function parseSpecifications(value: FormDataEntryValue | null): ServiceSpecification[] {
  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as ServiceSpecification[];
    return parsed
      .filter((row) => row.label.trim() && row.detail.trim())
      .map((row) => ({
        label: row.label.trim(),
        detail: row.detail.trim(),
      }));
  } catch {
    return [];
  }
}

function buildFeatureSections(
  keyFeatures: string[],
  benefitItems: string[],
): ServiceFeatureSection[] {
  return keyFeatures.map((title, index) => ({
    title,
    items: index === keyFeatures.length - 1 ? benefitItems : [],
  }));
}

export const HEMOSCAN_SAMPLE: Omit<ServiceInput, "categoryId"> = {
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
      detail: "270 mm (W) x 470 mm (H) x 420 mm (D); Net Weight: 20 kg",
    },
  ],
  advantageTitle: "The KRM Healthcare Advantage",
  advantageContent:
    "At KRM Healthcare, we realise that IVD hardware is a critical pillar of your clinical outcomes and daily business efficiency. Manufactured in our state-of-the-art facility at the Medical Device Park in Ujjain, the HemoScan 3000 is fully backed by our ISO 13485 quality management systems. We insulate your laboratory operations from volatile market swings by guaranteeing real-time technical resolution and an uninterrupted supply of high-grade, original consumables.",
  closingTitle: "Optimize Your Diagnostics Portfolio Today",
  closingDescription:
    "Partner with an industry leader focused on bringing local value chains to global standards.",
};
