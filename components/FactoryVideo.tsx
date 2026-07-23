import Image from "next/image";
import Link from "next/link";
import videoPoster from "@/public/videosection.png";

export default function FactoryVideo() {
  return (
    <section className="factory" aria-labelledby="factory-title">
      <div className="factory__media">
        <Image
          src={videoPoster}
          alt="KRM Healthcare factory water treatment facility"
          fill
          sizes="(max-width: 768px) 94vw, 680px"
        />
        <button
          className="factory__play"
          type="button"
          aria-label="Factory video coming soon"
          title="Factory video coming soon"
        >
          <span aria-hidden="true" />
        </button>
      </div>

      <div className="factory__panel">
        <h2 id="factory-title">
          Built with Precision. Backed by <strong>Quality.</strong>
        </h2>
        <Link href="/book">Visit Our Factory</Link>
      </div>
    </section>
  );
}
