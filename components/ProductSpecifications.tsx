"use client";

import { useEffect, useId, useState } from "react";
import type { ServiceSpecification } from "@/lib/admin-store";

type ProductSpecificationsProps = {
  specifications: ServiceSpecification[];
};

function previewText(text: string, wordCount = 3) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= wordCount) {
    return { preview: text.trim(), needsMore: false };
  }

  return {
    preview: `${words.slice(0, wordCount).join(" ")}…`,
    needsMore: true,
  };
}

function SpecModal({
  title,
  text,
  onClose,
}: {
  title: string;
  text: string;
  onClose: () => void;
}) {
  const titleId = useId();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="product-benefit-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="product-benefit-modal__backdrop"
        aria-label="Close specification details"
        onClick={onClose}
      />
      <div className="product-benefit-modal__panel">
        <div className="product-benefit-modal__header">
          <h3 id={titleId}>{title}</h3>
          <button
            type="button"
            className="product-benefit-modal__close"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <p className="product-benefit-modal__body">{text}</p>
      </div>
    </div>
  );
}

export default function ProductSpecifications({
  specifications,
}: ProductSpecificationsProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeRow = activeIndex === null ? null : specifications[activeIndex];

  return (
    <>
      <div className="specification-table">
        <div className="specification-table__head">Specification</div>
        <div className="specification-table__head">Details</div>

        {specifications.map((row, index) => {
          const { preview, needsMore } = previewText(row.detail);

          return (
            <div
              className="specification-table__row"
              key={`${row.label}-${index}`}
            >
              <div className="specification-table__label">{row.label}</div>
              <div className="specification-table__detail">
                <span className="specification-table__preview">{preview}</span>
                {needsMore ? (
                  <button
                    type="button"
                    className="specification-table__more"
                    onClick={() => setActiveIndex(index)}
                  >
                    Read more
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {activeRow ? (
        <SpecModal
          title={activeRow.label}
          text={activeRow.detail}
          onClose={() => setActiveIndex(null)}
        />
      ) : null}
    </>
  );
}
