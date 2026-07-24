"use client";

import { useEffect, useId, useState } from "react";

export type FAQItem = {
  question: string;
  answer?: string;
};

const defaultItems: FAQItem[] = [
  { question: "Installation" },
  { question: "Compatibility" },
  { question: "Support" },
];

type FAQOptionsProps = {
  items?: FAQItem[];
  /** @deprecated Prefer `items` with question + answer */
  options?: string[];
  className?: string;
};

function FAQModal({
  question,
  answer,
  onClose,
}: {
  question: string;
  answer: string;
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
        aria-label="Close FAQ answer"
        onClick={onClose}
      />
      <div className="product-benefit-modal__panel">
        <div className="product-benefit-modal__header">
          <h3 id={titleId}>{question}</h3>
          <button
            type="button"
            className="product-benefit-modal__close"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <p className="product-benefit-modal__body">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQOptions({
  items,
  options,
  className = "",
}: FAQOptionsProps) {
  const faqItems: FAQItem[] =
    items && items.length > 0
      ? items
      : options && options.length > 0
        ? options.map((question) => ({ question }))
        : defaultItems;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex === null ? null : faqItems[activeIndex];

  if (faqItems.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`faqs-panel__items ${className}`.trim()}>
        {faqItems.map((item, index) => (
          <button
            className={`faq-item${
              activeIndex === index ? " faq-item--active" : ""
            }`}
            key={`${item.question}-${index}`}
            type="button"
            onClick={() => {
              if (item.answer) {
                setActiveIndex(index);
              }
            }}
          >
            {item.question}
          </button>
        ))}
      </div>

      {activeItem?.answer ? (
        <FAQModal
          question={activeItem.question}
          answer={activeItem.answer}
          onClose={() => setActiveIndex(null)}
        />
      ) : null}
    </>
  );
}
