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

const FADE_INTERVAL_MS = 4500;

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

  useEffect(() => {
    if (items.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, FADE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [items.length]);

  return (
    <section
      className="certifications"
      id="certifications"
      aria-labelledby="certifications-title"
    >
      <h2 id="certifications-title">{data.title}</h2>

      <div className="certifications__showcase" aria-live="polite">
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const image = item.imageUrl ? (
            <Image
              className="certifications__image"
              src={item.imageUrl}
              alt={item.cardTitle}
              width={435}
              height={520}
              sizes="(max-width: 600px) 56vw, 435px"
              priority={index === 0}
            />
          ) : (
            <Image
              className="certifications__image"
              src={certificate}
              alt="ISO 9001:2015 quality management system certificate"
              sizes="(max-width: 600px) 56vw, 435px"
              priority={index === 0}
            />
          );

          const card = (
            <div className="certifications__card">
              <h3>{item.cardTitle}</h3>
              <p>{item.cardDescription}</p>
            </div>
          );

          const slideClassName = `certifications__slide${
            isActive ? " certifications__slide--active" : ""
          }`;

          if (item.fileUrl) {
            return (
              <a
                key={item.id}
                className={`certifications__download ${slideClassName}`}
                href={item.fileUrl}
                download
                aria-label={`Download ${item.cardTitle}`}
                aria-hidden={!isActive}
                tabIndex={isActive ? 0 : -1}
              >
                {image}
                {card}
              </a>
            );
          }

          return (
            <div
              key={item.id}
              className={slideClassName}
              aria-hidden={!isActive}
            >
              {image}
              {card}
            </div>
          );
        })}
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
