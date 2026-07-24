"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import logo from "@/public/logo.png";

export type NavItem = {
  href: string;
  label: string;
};

const CUSTOMER_CARE_PHONE = "90390 90548";
const CUSTOMER_CARE_PHONE_HREF = "tel:+919039090548";
const CUSTOMER_CARE_EMAIL = "customercare@krmhealthcare.in";
const CUSTOMER_CARE_EMAIL_HREF = "mailto:customercare@krmhealthcare.in";

type HeaderProps = {
  categoryItems?: NavItem[];
};

function PhoneIcon() {
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
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1l-2.2 2.9z"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      width="20"
      height="20"
    >
      <path
        fill="currentColor"
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"
      />
    </svg>
  );
}

export default function Header({ categoryItems = [] }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const topNavItems: NavItem[] = [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
  ];
  const endNavItems: NavItem[] = [{ href: "/contact", label: "Contact Us" }];

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 24);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <header
      className={`site-header${isScrolled ? " site-header--scrolled" : ""}`}
    >
      <Link
        className="brand"
        href="/"
        aria-label="KRM Healthcare home"
        prefetch
      >
        <Image src={logo} alt="" priority />
        <span className="brand__name">KRM Healthcare</span>
      </Link>

      <nav className="desktop-navigation" aria-label="Main navigation">
        {topNavItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}

        {categoryItems.length > 0 ? (
          <div className="nav-dropdown">
            <button
              className="nav-dropdown__trigger"
              type="button"
              aria-haspopup="true"
            >
              Products
              <span className="nav-dropdown__caret" aria-hidden="true" />
            </button>
            <div className="nav-dropdown__menu" role="menu">
              {categoryItems.map((item) => (
                <Link key={item.href} href={item.href} role="menuitem">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {endNavItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <a
          className="header-contact header-contact--phone"
          href={CUSTOMER_CARE_PHONE_HREF}
          aria-label={`Call customer care at ${CUSTOMER_CARE_PHONE}`}
        >
          <PhoneIcon />
          <span>{CUSTOMER_CARE_PHONE}</span>
        </a>

        <a
          className="header-contact header-contact--email"
          href={CUSTOMER_CARE_EMAIL_HREF}
          aria-label={`Email customer care at ${CUSTOMER_CARE_EMAIL}`}
          title={CUSTOMER_CARE_EMAIL}
        >
          <EmailIcon />
          <span className="header-contact__email-text">
            {CUSTOMER_CARE_EMAIL}
          </span>
        </a>

        <details className="menu">
          <summary aria-label="Open navigation menu">
            <span />
            <span />
            <span />
          </summary>
          <nav aria-label="Mobile navigation">
            {topNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}

            {categoryItems.length > 0 ? (
              <div className="menu__group">
                <p className="menu__group-label">Products</p>
                {categoryItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}

            {endNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
