import type { CategoryLanding } from "@/lib/category-landing";

export const hematologyLanding: CategoryLanding = {
  slug: "hematology",
  title: "Hematology Portfolio",
  tagline: "Global Equipment Quality & Local Prices",
  sections: [
    {
      type: "heading",
      text: "The Strategic Reality of Modern Hematology Labs",
    },
    {
      type: "intro",
      paragraphs: [
        "In a diagnostic landscape where market fluctuations compromise inventory security and foreign corporate markups squeeze profit margins, pathology lab owners need absolute predictability.",
        "At KRM Healthcare, we manufacture high-throughput, premium-tier hematology instrumentation and matching system reagents designed specifically to maximize operational productivity while protecting your baseline economics. By combining classical electrical impedance measurement and advanced laser scatter technology with an uninterrupted domestic supply chain, we deliver the perfect price-to-value fit for growing diagnostic businesses across India.",
      ],
    },
    {
      type: "heading",
      text: "Main Instrument Catalog",
    },
    {
      type: "paragraphs",
      paragraphs: [
        "Our analyzer portfolio bridges the gap between cost-efficiency and clinical data integrity, allowing laboratory business owners to confidently scale operations.",
      ],
    },
    {
      type: "productGrid",
      products: [
        {
          title: "HemoScan 3000",
          badge: "3-Part Automation",
          points: ["60 Samples/Hour", "9 µL Sample Volume"],
          href: "/products/hemoscan-3000-fully-automated-3-part-hematology-analyzer",
        },
        {
          title: "HemoScan 5000",
          badge: "5-Part Premium Diff",
          points: ["60 Samples/Hour", "Laser Scatter & Dye"],
          href: "/products/hemoscan-5000-fully-automated-5-part-hematology-analyzer",
        },
      ],
    },
    {
      type: "productGrid",
      products: [
        {
          title: "HemoScan 3000 – Fully Automated 3-Part Hematology Analyzer",
          idealFor:
            "Startup labs, tier-2/3 diagnostic facilities, and standalone franchise clinics.",
          points: [
            "Operational Throughput: Up to 60 samples per hour, minimizing sample waiting times to just one minute.",
            "Clinical Advantages: Requires an ultra-low aspiration volume (≤ 9 µL whole blood), eliminating painful redraws and serving as an ideal asset for pediatric testing.",
            "Key Technical Specs: Features a user-friendly 10.4-inch color TFT touch screen, customized software flagging abnormal cell warnings, and a massive internal vault storing up to 50,000 complete patient profiles with histograms.",
          ],
          href: "/products/hemoscan-3000-fully-automated-3-part-hematology-analyzer",
          cta: {
            label: "Request a Quote / Book a Live Demo",
            requirement: "HemoScan 3000 Quote / Demo",
            formName: "Category Enquiry",
          },
        },
        {
          title: "HemoScan 5000 – Fully Automated 5-Part Hematology Analyzer",
          idealFor:
            "High-volume reference laboratories, corporate franchise networks, and tier-1 multi-specialty hospitals.",
          points: [
            "Operational Throughput: Seamlessly processes up to 60 samples per hour with advanced continuous walk-away capacity.",
            "Clinical Advantages: Leverages semiconductor laser scatter technology combined with chemical dye methods to deliver true 25-parameter white blood cell differentials, drastically dropping manual slide review rates.",
            "Key Technical Specs: Interactive color TFT touch screen interface mapping 3D/2D scattergrams alongside traditional histograms, comprehensive automated calibration checks, and bi-directional LIS integration via standard HL7 protocols.",
          ],
          href: "/products/hemoscan-5000-fully-automated-5-part-hematology-analyzer",
          cta: {
            label: "Contact Enterprise Sales / Get Custom Pricing",
            requirement: "HemoScan 5000 Enterprise Sales",
            formName: "Category Enquiry",
          },
        },
      ],
    },
    {
      type: "heading",
      text: "BioScan Hematology System Reagents & Consumables",
    },
    {
      type: "paragraphs",
      paragraphs: [
        "An instrument is only as reliable as the chemical logistics powering it. To resolve the volatile day-to-day challenges of fully operational laboratories, we manufacture our own matching line of high-purity hematology reagents in our ISO 13485 certified Ujjain production facility.",
        "Our reagents are optimized for pristine system cleanliness, perfect cell volume sizing, and zero inter-sample carry-over.",
      ],
    },
    {
      type: "table",
      title: "System Reagents Catalog",
      headers: [
        "Code",
        "Reagent Product Line Name",
        "Pack Size Variant",
        "Core Functional Application",
      ],
      rows: [
        [
          "H001",
          "Diluent Reagent for Hematology Analyzer",
          "1 x 20L",
          "Maintains cellular integrity and provides stable osmotic balance for high-accuracy impedance counting.",
        ],
        [
          "H002",
          "Rinse Reagent for Hematology Analyzer",
          "1 x 20L",
          "Flushes the fluid path between cycles to protect against inter-sample cross-contamination.",
        ],
        [
          "H003",
          "Lyse Reagent for Hematology Analyzer",
          "1 x 100 ml / 1 x 500 ml",
          "Rapidly lyses red blood cells to enable precise HGB colorimetry and white blood cell differential isolation.",
        ],
        [
          "H004",
          "Cleaner Reagent for Hematology Analyzer",
          "1 x 50 ml",
          "Intensive, enzymatic background cleaning agent to eliminate protein buildup on apertures.",
        ],
      ],
    },
    {
      type: "cta",
      cta: {
        label: "Request a System Reagent Trial Kit",
        requirement: "System Reagent Trial Kit",
        formName: "Category Enquiry",
      },
    },
    {
      type: "advantages",
      title: "The KRM Healthcare Partnership Advantage",
      items: [
        {
          title: "Turnkey Lab Solutions",
          body: "We partner with regional distributors, channel specialists, and subject matter experts to offer end-to-end turnkey engineering layouts, hardware provisioning, and application support across India.",
        },
        {
          title: "Real-Time Technical Resolution",
          body: "Avoid long delays caused by international support queues. Our dedicated service engineering network provides real-time resolution to ensure your lab remains up and running.",
        },
        {
          title: "Rigid Quality Compliance",
          body: "Every instrument and reagent batch coming out of our Vikram Udyogpuri Medical Device Park facility meets high-spec quality standards, protecting your clinic from regulatory risks.",
        },
      ],
    },
    {
      type: "closing",
      title: "Command Your Regional Market Share",
      paragraphs: [
        "Insulate your diagnostics business from unpredictable cost structures. Partner with KRM Healthcare to bring international diagnostic standards to local cost parameters.",
      ],
    },
  ],
};
