import type { Metadata } from "next";
import Image from "next/image";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import contactImage from "@/public/contactus.png";

export const metadata: Metadata = {
  title: "Book Now | KRM Healthcare",
  description:
    "Book a consultation with KRM Healthcare for laboratory equipment, reagents, turnkey lab solutions, and franchise opportunities.",
};

export default function BookPage() {
  return (
    <main className="contact-page book-page">
      <Header />

      <section className="contact-hero" aria-labelledby="book-hero-title">
        <Image
          className="contact-hero__image"
          src={contactImage}
          alt="KRM Healthcare laboratory facility"
          priority
          sizes="100vw"
        />
        <div className="contact-hero__wash" aria-hidden="true" />
        <div className="contact-hero__content">
          <h1 id="book-hero-title">Book Now</h1>
          <p>
            Schedule a consultation with our team. Share your preferred date and
            requirements — we&apos;ll get back to you to confirm.
          </p>
        </div>
      </section>

      <section className="contact-form-section book-form-section" id="book-form">
        <BookingForm />

        <div className="contact-methods">
          <div>
            <strong>Visit Us</strong>
            <span>Medical Device Park, Ujjain</span>
          </div>
          <div>
            <strong>Call Us</strong>
            <span>90390 90548</span>
          </div>
          <div>
            <strong>Email Us</strong>
            <span>customercare@krmhealthcare.in</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
