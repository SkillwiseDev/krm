"use client";

import Image from "next/image";
import { useCallback, useRef, useState, type TouchEvent } from "react";
import type { ServiceApplication } from "@/lib/admin-store";
import applicationImage from "@/public/application.png";

type ProductApplicationsProps = {
  applications: ServiceApplication[];
};

export default function ProductApplications({
  applications,
}: ProductApplicationsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const active = applications[activeIndex] ?? applications[0];

  const goTo = useCallback(
    (index: number) => {
      if (applications.length === 0) return;
      const next =
        ((index % applications.length) + applications.length) %
        applications.length;
      setActiveIndex(next);
    },
    [applications.length],
  );

  const onTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent) => {
    if (touchStartX.current === null || applications.length < 2) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < 48) return;
    goTo(activeIndex + (delta < 0 ? 1 : -1));
  };

  if (!active) {
    return null;
  }

  return (
    <section
      className="product-applications"
      aria-labelledby="applications-title"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <h2 id="applications-title">Applications</h2>

      <article className="application-card" key={active.id} aria-live="polite">
        {active.iconUrl ? (
          <Image
            className="application-card__icon"
            src={active.iconUrl}
            alt=""
            width={142}
            height={142}
            sizes="144px"
          />
        ) : (
          <Image
            className="application-card__icon"
            src={applicationImage}
            alt=""
            sizes="144px"
          />
        )}
        <h3>{active.title}</h3>
      </article>

      {applications.length > 1 ? (
        <div
          className="application-dots"
          role="tablist"
          aria-label={`Application ${activeIndex + 1} of ${applications.length}`}
        >
          {applications.map((application, index) => (
            <button
              key={application.id}
              type="button"
              role="tab"
              aria-label={`Show ${application.title}`}
              aria-selected={index === activeIndex}
              className={
                index === activeIndex ? "application-dots__active" : undefined
              }
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
