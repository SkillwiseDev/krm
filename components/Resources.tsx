import Image from "next/image";
import resourceImage from "@/public/resource.png";

const resources = [
  "Product Brochures",
  "ISO & CE Certifications",
  "FAQs",
  "Blogs",
];

export default function Resources() {
  return (
    <section className="resources" aria-labelledby="resources-title">
      <h2 id="resources-title">Resources &amp; Downloads</h2>

      <div className="resources__content">
        <ul className="resources__links">
          {resources.map((resource) => (
            <li key={resource}>{resource}</li>
          ))}
        </ul>

        <div className="resources__visual">
          <div className="resources__shape" aria-hidden="true" />
          <Image
            src={resourceImage}
            alt="KRM BioScan laboratory analyzer and reagent products"
            sizes="(max-width: 600px) 48vw, 520px"
          />
        </div>
      </div>
    </section>
  );
}
