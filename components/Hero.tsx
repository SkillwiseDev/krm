import Image from "next/image";
import Link from "next/link";
import heroImage from "@/public/herosection.png";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Image
        className="hero__image"
        src={heroImage}
        alt="Modern laboratory equipment and glassware"
        fill
        priority
        sizes="100vw"
      />
      <div className="hero__wash" aria-hidden="true" />
      <div className="hero__content" id="home">
        <h1 id="hero-title">
          Global Equipment Quality. Local Prices.
          <br />
          Complete Laboratory Solutions.
        </h1>

        <p>
          <strong>Mission:</strong> To deliver reliable, affordable, and
          accessible in-vitro diagnostic solutions that empower healthcare
          providers across India to diagnose faster and treat better.
        </p>

        <p>
          <strong>Vision:</strong> To be India's most trusted diagnostics
          partner, expanding quality healthcare access to every corner of the
          country.
        </p>

        <p>
          <strong>Our Core Values:</strong>
        </p>

        <ol style={{ listStyleType: "decimal", paddingLeft: "20px" }}>
          <li>Quality</li>
          <li>Integrity</li>
          <li>Innovation</li>
          <li>Customer-Centricity</li>
        </ol>

        <Link className="hero__cta" href="/book">
          Schedule an Appointment
        </Link>
      </div>
    </section>
  );
}
