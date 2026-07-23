"use client";

import { useEffect, useId, useState } from "react";

type ProductBenefitsProps = {
  benefits: string[];
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

function benefitTitle(text: string) {
  const colonIndex = text.indexOf(":");
  if (colonIndex > 0 && colonIndex < 80) {
    return text.slice(0, colonIndex).trim();
  }

  return previewText(text, 4).preview.replace(/…$/, "");
}

function BenefitModal({
  text,
  onClose,
}: {
  text: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const title = benefitTitle(text);

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
        aria-label="Close benefit details"
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

export default function ProductBenefits({ benefits }: ProductBenefitsProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeText = activeIndex === null ? null : benefits[activeIndex];

  return (
    <>
      <ul className="product-benefits">
        {benefits.map((item, index) => {
          const { preview, needsMore } = previewText(item);

          return (
            <li key={`benefit-${index}`}>
              <span className="product-benefits__text">{preview}</span>
              {needsMore ? (
                <button
                  type="button"
                  className="product-benefits__more"
                  onClick={() => setActiveIndex(index)}
                >
                  Read more
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>

      {activeText ? (
        <BenefitModal text={activeText} onClose={() => setActiveIndex(null)} />
      ) : null}
    </>
  );
}
