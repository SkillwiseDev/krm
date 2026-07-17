import Image from "next/image";
import certificate from "@/public/certificate.png";

export default function Certifications() {
  return (
    <section className="certifications" aria-labelledby="certifications-title">
      <h2 id="certifications-title">Trust &amp; Certifications</h2>

      <div className="certifications__showcase">
        <Image
          className="certifications__image"
          src={certificate}
          alt="ISO 9001:2015 quality management system certificate"
          sizes="(max-width: 600px) 56vw, 435px"
        />

        <div className="certifications__card">
          <h3>ISO &amp; CE Standards</h3>
          <p>
            Products are manufactured following international quality
            standards.
          </p>
        </div>
      </div>
    </section>
  );
}
