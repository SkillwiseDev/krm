"use client";

import { useEffect, useRef, useState } from "react";

const benefits = [
  "Global Equipment Quality",
  "Customer Success",
  "Local Value Pricing",
  "360° Partnership",
  "Single Point of Contact",
  "Fast Reagent Supply",
];

function ArrowMark() {
  return (
    <svg viewBox="0 0 52 52" aria-hidden="true">
      <path d="m4 4 11 22L4 48l10-4 12-18L14 8 4 4Z" />
      <path d="m17 4 31 22-31 22 10-22L17 4Z" />
    </svg>
  );
}

export default function WhyChoose() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeBenefit, setActiveBenefit] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = window.setInterval(() => {
      setActiveBenefit((current) => (current + 1) % benefits.length);
    }, 2400);

    return () => window.clearInterval(interval);
  }, [isVisible]);

  return (
    <section
      className={`why-choose${isVisible ? " why-choose--visible" : ""}`}
      ref={sectionRef}
      aria-labelledby="why-choose-title"
    >
      <div className="why-choose__highlight">
        <h2 id="why-choose-title">
          Why Choose <span>KRM</span>
        </h2>
        <div
          className="why-choose__primary"
          aria-live="polite"
          aria-atomic="true"
        >
          <ArrowMark />
          <p className="why-choose__changing" key={activeBenefit}>
            {benefits[activeBenefit]}
          </p>
        </div>
      </div>
    </section>
  );
}
