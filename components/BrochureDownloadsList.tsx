"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { submitSiteForm, type SiteFormState } from "@/lib/site-form-actions";
import type { ProductBrochureItem } from "@/lib/product-brochures-store";

const initialState: SiteFormState = {};

type BrochureDownloadsListProps = {
  items: ProductBrochureItem[];
};

function triggerDownload(fileUrl: string, title: string) {
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = `${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "brochure"}.pdf`;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

type DownloadDialogProps = {
  item: ProductBrochureItem;
  onClose: () => void;
};

function DownloadDialog({ item, onClose }: DownloadDialogProps) {
  const titleId = useId();
  const [state, formAction, isPending] = useActionState(
    submitSiteForm,
    initialState,
  );
  const downloaded = useRef(false);

  useEffect(() => {
    if (!state.success || !item.fileUrl || downloaded.current) {
      return;
    }

    downloaded.current = true;
    triggerDownload(item.fileUrl, item.title);
  }, [state.success, item.fileUrl, item.title]);

  return (
    <div
      className="resource-download-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="resource-download-modal__backdrop"
        aria-label="Close download form"
        onClick={onClose}
      />

      <div className="resource-download-modal__panel">
        <div className="resource-download-modal__header">
          <h3 id={titleId}>{item.title}</h3>
          <button
            type="button"
            className="resource-download-modal__close"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {!item.fileUrl ? (
          <p className="contact-form__message contact-form__message--error">
            This brochure PDF is not available yet. Please check back soon.
          </p>
        ) : state.success ? (
          <div className="resource-download-modal__success">
            <p
              className="contact-form__message contact-form__message--success"
              role="status"
            >
              Thanks! Your download should start automatically.
            </p>
            <a
              className="resource-download-modal__retry"
              href={item.fileUrl}
              download
            >
              Download again
            </a>
            <button
              type="button"
              className="resource-download-modal__done"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        ) : (
          <form className="resource-download-form" action={formAction}>
            <input type="hidden" name="formName" value="Brochure Download" />
            <input type="hidden" name="sourcePage" value="Product Brochures" />
            <input type="hidden" name="sourcePath" value="/brochures" />
            <input type="hidden" name="requirementType" value={item.title} />

            <p className="resource-download-form__hint">
              Share your details to download the PDF.
            </p>

            <label>
              <span className="sr-only">Name</span>
              <input
                type="text"
                name="firstName"
                placeholder="Name"
                required
                autoFocus
              />
            </label>
            <label>
              <span className="sr-only">Email</span>
              <input type="email" name="email" placeholder="Email" required />
            </label>
            <label>
              <span className="sr-only">Phone</span>
              <input type="tel" name="phone" placeholder="Phone" required />
            </label>

            {state.error ? (
              <p
                className="contact-form__message contact-form__message--error"
                role="alert"
              >
                {state.error}
              </p>
            ) : null}

            <button type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Download PDF"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function BrochureDownloadsList({
  items,
}: BrochureDownloadsListProps) {
  const [activeItem, setActiveItem] = useState<ProductBrochureItem | null>(
    null,
  );

  return (
    <>
      <ul className="brochures-page__grid">
        {items.map((item) => (
          <li key={item.id}>
            {item.fileUrl ? (
              <button
                className="brochures-page__card"
                type="button"
                onClick={() => setActiveItem(item)}
                aria-label={`Download ${item.title}`}
              >
                <h2>{item.title}</h2>
                <span className="brochures-page__cta">
                  Download PDF <span aria-hidden="true">→</span>
                </span>
              </button>
            ) : (
              <article className="brochures-page__card">
                <h2>{item.title}</h2>
                <span className="brochures-page__cta brochures-page__cta--muted">
                  PDF coming soon
                </span>
              </article>
            )}
          </li>
        ))}
      </ul>

      {activeItem ? (
        <DownloadDialog
          key={activeItem.id}
          item={activeItem}
          onClose={() => setActiveItem(null)}
        />
      ) : null}
    </>
  );
}
