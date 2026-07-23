"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { contactFormLink } from "@/lib/contact-links";

const WHATSAPP_URL =
  "https://wa.me/919039090548?text=Hi%20KRM%20Healthcare%2C%20I%20would%20like%20to%20know%20more.";

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      width="18"
      height="18"
    >
      <path
        fill="currentColor"
        d="M17.5 14.4c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-1.6-.8-2.7-1.5-3.7-3.3-.3-.5.3-.4.8-1.4.1-.2 0-.4-.1-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.2.2 1.8 2.8 4.4 3.8 1.6.6 2.2.7 3 .6.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.2.1-1.3-.1-.1-.3-.2-.6-.3zM12.1 21h-.1c-1.7 0-3.3-.4-4.8-1.3l-.3-.2-3.5.9 1-3.4-.2-.3A8.9 8.9 0 0 1 3 11.9C3 7 7 3 12 3s9 4 9 8.9-4 9.1-8.9 9.1zm0-16.2A7.2 7.2 0 0 0 4.8 12c0 1.4.4 2.7 1.1 3.9l.2.3-.6 2.1 2.2-.6.3.2c1.1.6 2.4 1 3.7 1h.1c4 0 7.2-3.2 7.2-7.2S16 4.8 12.1 4.8z"
      />
    </svg>
  );
}

function FactoryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      width="18"
      height="18"
    >
      <path
        fill="currentColor"
        d="M2 20V9l6 3V9l6 3V4h8v16H2zm14-2h4v-4h-2v2h-2v2zm0-4h2v-2h2V8h-4v6zM4 18h4v-3H6v-2h2v-1.2L4 10.5V18zm6 0h4v-4.2l-4-2V18z"
      />
    </svg>
  );
}

export default function FloaterBars() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const factoryVisitHref = contactFormLink({
    requirement: "Book Factory Visit",
    sourcePage: "Floater",
    sourcePath: pathname || "/",
    formName: "Factory Visit Booking",
  });

  return (
    <div className="floater-bars" aria-label="Quick actions">
      <a
        className="floater-bars__item floater-bars__item--whatsapp"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppIcon />
        <span>WhatsApp</span>
      </a>
      <Link
        className="floater-bars__item floater-bars__item--factory"
        href={factoryVisitHref}
      >
        <FactoryIcon />
        <span>Book Factory Visit</span>
      </Link>
    </div>
  );
}
