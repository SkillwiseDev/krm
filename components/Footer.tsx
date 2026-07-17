import Image from "next/image";
import logo from "@/public/logo.png";

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer__content">
        <div className="footer__brand">
          <a href="#home" aria-label="KRM Healthcare home">
            <Image src={logo} alt="KRM Healthcare" />
          </a>
          <p>
            Global equipment quality, local value and complete laboratory
            solutions.
          </p>
        </div>

        <nav className="footer__nav" aria-label="Footer navigation">
          <p>Explore</p>
          <a href="#home">Home</a>
          <a href="#services">Products</a>
        </nav>

        <div className="footer__contact">
          <p>Contact Us</p>
          <span>Ready to build a better laboratory?</span>
          <a href="#home">Book a consultation</a>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© 2026 KRM Healthcare. All rights reserved.</span>
        <a href="#home">Back to top ↑</a>
      </div>
    </footer>
  );
}
