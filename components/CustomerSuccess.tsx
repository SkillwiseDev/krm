import Image from "next/image";
import customerPortrait from "@/public/customer-founder.png";

export default function CustomerSuccess() {
  return (
    <section className="customer-success" aria-labelledby="customer-title">
      <h2 id="customer-title">Customer Success</h2>

      <article className="testimonial">
        <Image
          className="testimonial__portrait"
          src={customerPortrait}
          alt="KRM Healthcare customer"
          sizes="(max-width: 600px) 150px, 225px"
        />

        <div className="testimonial__content">
          <blockquote>
            The trust of laboratory professionals is built through reliable
            products, timely support and consistent service. Hear directly from
            customers who work with KRM Healthcare.
          </blockquote>
          <div className="testimonial__divider" aria-hidden="true" />
          <p className="testimonial__role">Founder</p>
          <p className="testimonial__company">Suburban</p>
        </div>
      </article>
    </section>
  );
}
