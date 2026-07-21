import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { contactFormLink } from "@/lib/contact-links";
import contactImage from "@/public/contactus.png";

export const metadata: Metadata = {
  title: "Contact Us | KRM Healthcare",
  description:
    "Get in touch with KRM Healthcare for laboratory equipment, reagents, turnkey lab solutions, and franchise opportunities.",
};

type ContactPageProps = {
  searchParams: Promise<{
    requirement?: string;
    source?: string;
    from?: string;
    form?: string;
  }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;

  return (
    <main className="contact-page">
      <Header />

      <section className="contact-hero" aria-labelledby="contact-hero-title">
        <Image
          className="contact-hero__image"
          src={contactImage}
          alt="KRM Healthcare laboratory facility"
          priority
          sizes="100vw"
        />
        <div className="contact-hero__wash" aria-hidden="true" />
        <div className="contact-hero__content">
          <h1 id="contact-hero-title">Get in Touch</h1>
          <p>
            Whether you&apos;re looking for laboratory equipment, reagents,
            turnkey lab solutions or franchise opportunities, our team is here
            to help. Connect with our experts to discuss your requirements and
            find the right solution for your laboratory.
          </p>
        </div>
      </section>

      <section
        className="contact-requirements"
        aria-labelledby="contact-requirements-title"
      >
        <h2 id="contact-requirements-title">Select Your Requirement</h2>

        <div className="requirement-grid">
          <article className="requirement-card">
            <h3>Product Enquiry</h3>
            <p>Looking for laboratory equipment or reagents?</p>
            <Link
              href={contactFormLink({
                requirement: "Product Enquiry",
                sourcePage: "Contact",
                sourcePath: "/contact",
              })}
            >
              Contact Sales
            </Link>
          </article>

          <article className="requirement-card">
            <h3>Technical Support</h3>
            <p>Need assistance with your laboratory equipment?</p>
            <Link
              href={contactFormLink({
                requirement: "Technical Support",
                sourcePage: "Contact",
                sourcePath: "/contact",
              })}
            >
              Get Support
            </Link>
          </article>

          <article className="requirement-card">
            <h3>Turnkey Laboratory Solutions</h3>
            <p>Planning to establish a new laboratory?</p>
            <Link
              href={contactFormLink({
                requirement: "Turnkey Laboratory Solutions",
                sourcePage: "Contact",
                sourcePath: "/contact",
              })}
            >
              Speak to a Consultant
            </Link>
          </article>

          <article className="requirement-card">
            <h3>Franchise Enquiry</h3>
            <p>Interested in opening a pathology laboratory?</p>
            <Link
              href={contactFormLink({
                requirement: "Franchise Enquiry",
                sourcePage: "Contact",
                sourcePath: "/contact",
              })}
            >
              Learn More
            </Link>
          </article>
        </div>
      </section>

      <section className="contact-form-section" id="contact-form">
        <ContactForm
          formName={params.form ?? "Contact Enquiry"}
          sourcePage={params.source ?? "Contact"}
          sourcePath={params.from ?? "/contact"}
          requirementType={params.requirement}
        />

        <div className="contact-methods">
          <div>
            <strong>Visit Us</strong>
            <span>Factory / Office Address</span>
          </div>
          <div>
            <strong>Call Us</strong>
            <span>Business Phone Number</span>
          </div>
          <div>
            <strong>Email Us</strong>
            <span>Official Email Address</span>
          </div>
          <div>
            <strong>WhatsApp Support</strong>
          </div>
        </div>
      </section>

      <section className="contact-map" aria-label="Medical Device Park Ujjain location">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4903.2146300558215!2d75.96663307637014!3d23.08821597912795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39631300655340a3%3A0xb29cff2735901799!2sMedical%20Device%20Park%20Ujjain!5e1!3m2!1sen!2sin!4v1784528840079!5m2!1sen!2sin"
          title="Medical Device Park Ujjain map"
          width="600"
          height="450"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </section>

      <Footer />
    </main>
  );
}
