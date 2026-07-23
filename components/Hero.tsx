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
          KRM Healthcare manufactures high-quality laboratory equipment and
          reagents while providing complete pathology lab solutions.
        </p>
        <Link className="hero__cta" href="/book">
          Book now
        </Link>
      </div>
    </section>
  );
}
