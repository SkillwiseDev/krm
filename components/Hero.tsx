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
          We are on a mission to deliver reliable, affordable, and accessible
          in-vitro diagnostic solutions that empower healthcare providers across
          India to diagnose faster and treat better.
          <br />
          <br />
          <strong>Vision:</strong> To be India's most trusted diagnostics
          partner, expanding quality healthcare access to every corner of the
          country.
          <br />
          <br />
          <strong>Our Core Values:</strong> Quality, Integrity, Innovation,
          Customer-Centricity.
        </p>
        <Link className="hero__cta" href="/book">
          Schedule an Appointment
        </Link>
      </div>
    </section>
  );
}
