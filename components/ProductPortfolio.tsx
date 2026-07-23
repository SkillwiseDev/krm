"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState, type TouchEvent } from "react";
import productImage from "@/public/image.png";

export type PortfolioItem = {
  id: string;
  title: string;
  href: string;
  imageUrl?: string;
};

type ProductPortfolioProps = {
  items: PortfolioItem[];
};

export default function ProductPortfolio({ items }: ProductPortfolioProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const active = items[activeIndex] ?? items[0];

  const goTo = useCallback(
    (index: number) => {
      if (items.length === 0) return;
      const next = ((index % items.length) + items.length) % items.length;
      setActiveIndex(next);
    },
    [items.length],
  );

  const onTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent) => {
    if (touchStartX.current === null || items.length < 2) return;

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
      className="product-portfolio"
      aria-labelledby="product-portfolio-title"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <h2 id="product-portfolio-title">Product Portfolio</h2>

      <div className="product-portfolio__image-wrap" aria-live="polite">
        {active.imageUrl ? (
          <Image
            key={active.id}
            className="product-portfolio__image"
            src={active.imageUrl}
            alt={active.title}
            width={280}
            height={200}
            sizes="(max-width: 600px) 52vw, 280px"
          />
        ) : (
          <Image
            key={active.id}
            className="product-portfolio__image"
            src={productImage}
            alt={active.title}
            sizes="(max-width: 600px) 52vw, 280px"
          />
        )}
      </div>

      <article className="portfolio-card" key={active.id}>
        <h3>{active.title}</h3>
        <Link className="portfolio-card__link" href={active.href}>
          Learn More <span aria-hidden="true">→</span>
        </Link>
      </article>

      {items.length > 1 ? (
        <div
          className="portfolio-dots"
          role="tablist"
          aria-label={`Product ${activeIndex + 1} of ${items.length}`}
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-label={`Show ${item.title}`}
              aria-selected={index === activeIndex}
              className={
                index === activeIndex ? "portfolio-dots__active" : undefined
              }
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      ) : (
        <div
          className="portfolio-dots"
          aria-label={`Product 1 of ${items.length}`}
        >
          <span className="portfolio-dots__active" />
        </div>
      )}
    </section>
  );
}
