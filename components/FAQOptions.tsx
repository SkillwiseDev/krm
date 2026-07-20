"use client";

import { useState } from "react";

const defaultOptions = ["Installation", "Compatibility", "Support"];

type FAQOptionsProps = {
  options?: string[];
  className?: string;
};

export default function FAQOptions({
  options = defaultOptions,
  className = "",
}: FAQOptionsProps) {
  const [activeOption, setActiveOption] = useState(options[0]);

  return (
    <div className={`faqs-panel__items ${className}`.trim()}>
      {options.map((option) => (
        <button
          className={`faq-item${
            activeOption === option ? " faq-item--active" : ""
          }`}
          key={option}
          type="button"
          aria-pressed={activeOption === option}
          onClick={() => setActiveOption(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
