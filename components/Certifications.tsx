"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import certificate from "@/public/certificate.png";
import type {
  SiteCertificationItem,
  SiteCertifications,
} from "@/lib/site-certifications-store";

type CertificationsProps = {
  data: SiteCertifications;
};

const FADE_INTERVAL_MS = 4000;

export default function Certifications({ data }: CertificationsProps) {
  const items =
    data.items.length > 0
      ? data.items
      : ([
          {
            id: "fallback",
            cardTitle: "ISO & CE Standards",
            cardDescription:
              "Products are manufactured following international quality standards.",
          },
        ] satisfies SiteCertificationItem[]);

  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex] ?? items[0];

  useEffect(() => {
    if (items.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, FADE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [items.length]);

  if (!active) {
    return null;
  }

  const image = active.imageUrl ? (
    <Image
      key={`${active.id}-image`}
      className="certifications__image"
      src={active.imageUrl}
      alt={active.cardTitle}
      width={435}
      height={520}
      sizes="(max-width: 600px) 56vw, 435px"
    />
  ) : (
    <Image
      key={`${active.id}-fallback-image`}
      className="certifications__image"
      src={certificate}
      alt="ISO 9001:2015 quality management system certificate"
      sizes="(max-width: 600px) 56vw, 435px"
    />
  );

  const card = (
    <div className="certifications__card" key={`${active.id}-card`}>
      <h3>{active.cardTitle}</h3>
      <p>{active.cardDescription}</p>
    </div>
  );

  return (
    <section
      className="certifications"
      id="certifications"
      aria-labelledby="certifications-title"
    >
      <h2 id="certifications-title">{data.title}</h2>

      <div className="certifications__showcase" aria-live="polite">
        {active.fileUrl ? (
          <a
            className="certifications__download"
            href={active.fileUrl}
            download
            aria-label={`Download ${active.cardTitle}`}
          >
            {image}
            {card}
          </a>
        ) : (
          <>
            {image}
            {card}
          </>
        )}
      </div>

      {items.length > 1 ? (
        <div
          className="certifications__dots"
          role="tablist"
          aria-label={`Certificate ${activeIndex + 1} of ${items.length}`}
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-label={`Show ${item.cardTitle}`}
              aria-selected={index === activeIndex}
              className={
                index === activeIndex ? "certifications__dots-active" : undefined
              }
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
