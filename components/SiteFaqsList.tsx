"use client";

import { useId, useState } from "react";
import type { SiteFaqItem, SiteFaqSection } from "@/lib/site-faqs";

function FaqAnswer({ item }: { item: SiteFaqItem }) {
  return (
    <div className="faqs-page__answer">
      {item.answerParagraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
      {item.answerBullets && item.answerBullets.length > 0 ? (
        <ul>
          {item.answerBullets.map((bullet) => (
            <li key={bullet.slice(0, 48)}>{bullet}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function FaqItem({
  item,
  index,
  open,
  onToggle,
}: {
  item: SiteFaqItem;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();

  return (
    <article className={`faqs-page__item${open ? " is-open" : ""}`}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className="faqs-page__q-label">Q{index}</span>
          <span className="faqs-page__q-text">{item.question}</span>
          <span className="faqs-page__chevron" aria-hidden="true" />
        </button>
      </h3>
      <div
        className="faqs-page__panel"
        id={panelId}
        hidden={!open}
      >
        <p className="faqs-page__a-label">A</p>
        <FaqAnswer item={item} />
      </div>
    </article>
  );
}

export default function SiteFaqsList({
  sections,
}: {
  sections: SiteFaqSection[];
}) {
  const [openKey, setOpenKey] = useState<string | null>(
    sections[0]?.items[0]?.id ?? null,
  );

  let questionNumber = 0;

  return (
    <div className="faqs-page__sections">
      {sections.map((section) => (
        <section
          key={section.id}
          className="faqs-page__section"
          aria-labelledby={`faq-section-${section.id}`}
        >
          <h2 id={`faq-section-${section.id}`}>{section.title}</h2>
          <div className="faqs-page__list">
            {section.items.map((item) => {
              questionNumber += 1;
              const number = questionNumber;
              return (
                <FaqItem
                  key={item.id}
                  item={item}
                  index={number}
                  open={openKey === item.id}
                  onToggle={() =>
                    setOpenKey((current) =>
                      current === item.id ? null : item.id,
                    )
                  }
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
