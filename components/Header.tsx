"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "@/public/logo.png";
import NavigationMenu from "@/components/NavigationMenu";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

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
      <a className="brand" href="#home" aria-label="KRM Healthcare home">
        <Image src={logo} alt="KRM Healthcare" priority />
      </a>
      <NavigationMenu />
    </header>
  );
}
