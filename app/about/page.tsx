import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { contactFormLink } from "@/lib/contact-links";
import aboutUsImage from "@/public/aboutus.png";

export const metadata: Metadata = {
  title: "About Us | KRM Healthcare",
  description:
    "Learn how KRM Healthcare delivers global equipment quality at local prices with ISO 13485 manufacturing, supply security, and real-time technical support for pathology labs across India.",
};

const partnerRows = [
  {
    pillar: "Pristine Quality Standards",
    guarantee:
      "Certified ISO 13485 manufacturing processes guaranteeing high analytical sensitivity and accuracy across all equipment and reagent batches.",
  },
  {
    pillar: "Supply Chain Stability",
    guarantee:
      "Complete domestic production insulates your laboratory from unpredictable international freight surges and market fluctuations.",
  },
  {
    pillar: "Cost-Per-Test Economics",
    guarantee:
      "Unlocking higher profitability for your lab without compromising on clinical data integrity or patient outcomes.",
  },
  {
    pillar: "Turnkey Expertise",
    guarantee:
      "Strong channel partnerships with regional experts and distributors to deliver end-to-end setup and ongoing application support.",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="about-page">
      <SiteHeader />

      <section className="about-hero" aria-labelledby="about-title">
        <h1 id="about-title">About Us</h1>
      </section>

      <div className="about-content">
        <section className="about-section" aria-labelledby="about-story-title">
          <h2 id="about-story-title">
            Our Story: Built from a Vision for Pathology Excellence
          </h2>
          <p>
            KRM Healthcare was born from a fundamental realisation within the
            clinical diagnostic landscape. While exploring the path to set up a
            pathology laboratory, our founders recognised that in vitro
            diagnostic (IVD) hardware and consumables are far more than just
            commercial instruments—they are the operational heartbeat of
            healthcare decision-making.
          </p>
          <p>
            At the time, the Indian IVD ecosystem remained largely unorganised,
            making it exceptionally difficult for laboratory owners to find a
            truly reliable, holistic brand partner. Driven by an earnest desire
            to create a win-win model for all pathology stakeholders and inspired
            by a personal family legacy of integrity, KRM Healthcare was
            founded.
          </p>
          <p>
            Our mission from day one has remained unchanged: to build an
            enduring brand legacy anchored in uncompromising quality, localised
            value creation, and complete operational trust.
          </p>
        </section>

        <section
          className="about-section about-section--architecture"
          aria-labelledby="about-purpose-title"
        >
          <h2 id="about-purpose-title" className="sr-only">
            What Drives Us: Our Core Purpose
          </h2>
          <Image
            className="about-architecture"
            src={aboutUsImage}
            alt="The KRM Healthcare Value Architecture: Global Quality, Supply Security, and Real-Time Resolution"
            sizes="(max-width: 900px) calc(100vw - 48px), 900px"
            priority
          />
        </section>

        <section
          className="about-section"
          aria-labelledby="about-challenges-title"
        >
          <h2 id="about-challenges-title">
            Overcoming Today&apos;s Laboratory Challenges
          </h2>
          <p>
            Pathologists and laboratory business owners face persistent
            operational friction that threatens both clinical outcomes and
            business viability:
          </p>
          <ol className="about-challenges">
            <li>
              <strong>
                Inflated Foreign Prices &amp; Low Value Realization:
              </strong>{" "}
              Diagnostic facilities are often forced to pay high prices for
              imported reagents and equipment, despite the quality not
              justifying the steep investment.
            </li>
            <li>
              <strong>Supply Chain Disruptions:</strong> Market fluctuations
              frequently lead to inventory delays and stockouts, halting daily
              sample processing.
            </li>
            <li>
              <strong>Delayed Technical Support:</strong> When equipment
              requires calibration or troubleshooting, international vendors
              often take days to respond, leaving diagnostic labs stranded.
            </li>
          </ol>
        </section>

        <section
          className="about-section"
          aria-labelledby="about-solution-title"
        >
          <h2 id="about-solution-title">The KRM Solution</h2>
          <p>
            We eliminate these barriers by controlling the domestic value chain.
            Operating out of our state-of-the-art facility at the Medical Device
            Park in Vikram Udyogpuri, Ujjain, we manufacture world-class
            diagnostic equipment and matching liquid consumables under strict
            ISO 13485 standards.
          </p>
          <p>
            By delivering{" "}
            <strong>Global Equipment Quality at Local Prices</strong>, we
            empower laboratories to achieve sustainable cost-per-test economics,
            guaranteed stock availability, and immediate, real-time technical
            resolution.
          </p>
        </section>

        <section
          className="about-section"
          aria-labelledby="about-ecosystem-title"
        >
          <h2 id="about-ecosystem-title">
            How We Operate: Our Multichannel Ecosystem
          </h2>
          <p>
            To ensure seamless accessibility across every corner of the country,
            KRM Healthcare operates a versatile, end-to-end business model:
          </p>
          <ul className="about-ecosystem">
            <li>
              <strong>In-House Manufacturing:</strong> We engineer and build
              high-throughput hematology counters, semi-automated biochemistry
              analyzers, and open-system reagents directly for dealers and
              diagnostic owners at transparent, pre-approved costs.
            </li>
            <li>
              <strong>Turnkey Doctor Franchises:</strong> We offer annual
              license models designed specifically for doctors and entrepreneurs
              setting up new diagnostic facilities, guiding them from layout
              planning to final validation.
            </li>
            <li>
              <strong>Fast-Velocity Reagent Supply:</strong> We maintain rapid
              2-to-7 day fulfillment cycles for our BioScan liquid reagents and
              RapidScan lateral flow panels, keeping local lab inventories fully
              stocked.
            </li>
            <li>
              <strong>Global Footprint:</strong> We extend our high-grade rapid
              diagnostic test kits to international markets, showcasing Indian
              manufacturing excellence on the world stage.
            </li>
          </ul>
        </section>

        <section
          className="about-section about-section--partner"
          aria-labelledby="about-partner-title"
        >
          <h2 id="about-partner-title">Why Partner with KRM Healthcare?</h2>

          <div className="about-partner-table-wrap">
            <table className="about-partner-table">
              <thead>
                <tr>
                  <th scope="col">Strategic Pillar</th>
                  <th scope="col">The KRM Healthcare Guarantee</th>
                </tr>
              </thead>
              <tbody>
                {partnerRows.map((row) => (
                  <tr key={row.pillar}>
                    <th scope="row">{row.pillar}</th>
                    <td>{row.guarantee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="about-cta" aria-labelledby="about-cta-title">
          <h2 id="about-cta-title">
            Transform Your Diagnostic Operations Today
          </h2>
          <p>
            Experience how our locally manufactured, world-class IVD ecosystem
            can elevate your lab&apos;s productivity.
          </p>
          <ul className="about-cta__links">
            <li>
              <Link href="/services">Explore Our Product Catalog</Link>
            </li>
            <li>
              <Link href="/contact">Contact Our Team</Link>
            </li>
            <li>
              <Link
                href={contactFormLink({
                  requirement: "Request a Reagent Testing Kit",
                  sourcePage: "About",
                  sourcePath: "/about",
                  formName: "Reagent Testing Kit Request",
                })}
              >
                Request a Reagent Testing Kit
              </Link>
            </li>
          </ul>
        </section>
      </div>

      <Footer />
    </main>
  );
}
