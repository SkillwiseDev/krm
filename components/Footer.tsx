import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer__content">
        <div className="footer__brand">
          <Link href="/" aria-label="KRM Healthcare home">
            <Image src={logo} alt="KRM Healthcare" />
          </Link>
          <p>
            Global equipment quality, local value and complete laboratory
            solutions.
          </p>
        </div>

        <nav className="footer__nav" aria-label="Footer navigation">
          <p>Explore</p>
          <Link href="/">Home</Link>
          <Link href="/services">Products</Link>
        </nav>

        <div className="footer__contact">
          <p>Contact Us</p>
          <span>Ready to build a better laboratory?</span>
          <Link href="/book">Book a consultation</Link>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© 2026 KRM Healthcare. All rights reserved.</span>
        <a href="#home">Back to top ↑</a>
      </div>
    </footer>
  );
}
