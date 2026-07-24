export type SiteFaqItem = {
  id: string;
  question: string;
  answerParagraphs: string[];
  answerBullets?: string[];
};

export type SiteFaqSection = {
  id: string;
  title: string;
  items: SiteFaqItem[];
};

export const siteFaqSections: SiteFaqSection[] = [
  {
    id: "general",
    title: "General & Strategic Procurement",
    items: [
      {
        id: "q1",
        question:
          "What core product lines does KRM Healthcare specialize in?",
        answerParagraphs: [
          "KRM Healthcare provides a comprehensive portfolio of In Vitro Diagnostic (IVD) solutions. Our flagship offerings include:",
        ],
        answerBullets: [
          "Clinical Chemistry Reagents & Equipment: BioScan liquid stable chemistry reagents and ChemoScan semi-automated analyzers.",
          "Hematology Solutions: HemoScan 3000 (3-Part) and HemoScan 5000 (5-Part) automated analyzers with dedicated hematology reagents.",
          "Rapid Diagnostics: RapidScan (Made in India) lateral flow tests for infectious diseases, tropical profile, cardiac biomarkers, and hormone/fertility testing.",
        ],
      },
      {
        id: "q2",
        question:
          "Why should diagnostic labs and hospitals choose KRM Healthcare over other suppliers?",
        answerParagraphs: [
          "We bridge the gap between high-end international precision and cost-effective domestic operation. Key advantages include:",
        ],
        answerBullets: [
          "ISO 13485 Certified Manufacturing: Produced in our state-of-the-art facility in the Medical Device Park, Ujjain (MP), India.",
          "Cost-Effective High Throughput: Uncompromised test accuracy designed to minimize cost-per-test without sacrificial degradation of reagent stability.",
          "Smart Calibration Facility: Integrated, cost-effective smart calibration for critical assays like HbA1c, CRP, RF, and ASO.",
          "Dedicated After-Sales & Application Support: Local service technicians and application specialists to ensure zero operational downtime.",
        ],
      },
    ],
  },
  {
    id: "equipment",
    title: "Equipment & Analyzer Specifications",
    items: [
      {
        id: "q3",
        question:
          "What makes the ChemoScan Semi-Auto Biochemistry Analyzer ideal for growing labs?",
        answerParagraphs: [
          "The ChemoScan is built for high reliability, precision, and ease of use:",
        ],
        answerBullets: [
          "Versatile Menu: Direct access to over 200 open test programs with a triple cuvette system (18 µl Flow cell, 10 mm square cuvette, and round tube for coagulation).",
          "Long-Life Circuitry: Features a maintenance-free peristaltic pump and unique circuitry designed for extended lamp life.",
          "Advanced Analytics: Displays real-time reaction graphs, Levey-Jennings QC charts, and standard deviation tracking.",
        ],
      },
      {
        id: "q4",
        question:
          "What is the main difference between the HemoScan 3000 and HemoScan 5000 hematology analyzers?",
        answerParagraphs: [],
        answerBullets: [
          "HemoScan 3000 (3-Part): Delivers 21 parameters with 3 histograms at a throughput of 60 samples/hour. Ideal for small-to-medium laboratories looking for low sample consumption (only 9 µL whole blood per test) and cyanide-free safe reagents.",
          "HemoScan 5000 (5-Part): Utilizes advanced Flow Cytometry (FCM), laser light scatter, and cytochemical staining to deliver 25 reportable parameters + 4 research parameters with 4 scattergrams and 2 histograms. Perfect for high-volume hospital labs and advanced reference centers requiring detailed differential analysis.",
        ],
      },
    ],
  },
  {
    id: "reagents",
    title: "Reagents, Re-ordering & Compatibility",
    items: [
      {
        id: "q5",
        question:
          "Are KRM Healthcare’s BioScan reagents compatible with third-party open analyzers?",
        answerParagraphs: [
          "Yes. While optimized for maximum performance on ChemoScan analyzers, our BioScan liquid-stable chemistry reagents are formulated to be fully adaptable for open semi-automated and fully-automated biochemistry platforms.",
        ],
      },
      {
        id: "q6",
        question:
          "How do I order reagents, request product catalogs, or get a quotation?",
        answerParagraphs: [
          "You can request a custom quote or request distributor details directly through our portal:",
        ],
        answerBullets: [
          'Website Inquiry: Use the "Request a Quote" button on our homepage or product pages.',
          "Direct Customer Support: Call our dedicated helpline at +91 90390 90548 or email customercare@krmhealthcare.in.",
          "Distributor Inquiries: If you are interested in becoming an authorized distribution partner, contact our sales department via the inquiry form.",
        ],
      },
    ],
  },
  {
    id: "quality",
    title: "Quality, Compliance & Support",
    items: [
      {
        id: "q7",
        question:
          "What quality and manufacturing standards do KRM Healthcare products adhere to?",
        answerParagraphs: [
          "KRM Healthcare operates under strict quality management systems in full compliance with ISO 13485 standards. All reagents and instruments undergo rigorous quality control (QC) and lot-to-lot validation to guarantee accuracy, precision, and batch stability.",
        ],
      },
      {
        id: "q8",
        question:
          "What kind of technical and post-installment support does KRM offer?",
        answerParagraphs: [
          "We ensure end-to-end support for every diagnostic partner:",
        ],
        answerBullets: [
          "Installation & User Training: On-site installation and comprehensive staff training by qualified application engineers.",
          "Maintenance & Technical Service: Rapid response maintenance, routine quality checkups, and quick troubleshooting support.",
          "LIS Integration: Our analyzers (such as HemoScan series) feature standard LAN/Ethernet ports supporting HL7 protocol for seamless integration into Laboratory Information Systems (LIS).",
        ],
      },
    ],
  },
];
