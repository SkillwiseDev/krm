"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { submitSiteForm, type SiteFormState } from "@/lib/site-form-actions";
import type { TechnicalResourceItem } from "@/lib/technical-resources-store";

const initialState: SiteFormState = {};

type TechnicalResourcesSectionProps = {
  items: TechnicalResourceItem[];
};

function triggerDownload(fileUrl: string, title: string) {
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = `${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "resource"}.pdf`;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

type DownloadDialogProps = {
  item: TechnicalResourceItem;
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

        {item.content ? (
          <p className="resource-download-modal__content">{item.content}</p>
        ) : null}

        {!item.fileUrl ? (
          <p className="contact-form__message contact-form__message--error">
            This resource PDF is not available yet. Please check back soon.
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
            <input
              type="hidden"
              name="formName"
              value="Technical Resource Download"
            />
            <input type="hidden" name="sourcePage" value="Services" />
            <input type="hidden" name="sourcePath" value="/services" />
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

export default function TechnicalResourcesSection({
  items,
}: TechnicalResourcesSectionProps) {
  const [activeItem, setActiveItem] = useState<TechnicalResourceItem | null>(
    null,
  );

  return (
    <>
      <div className="technical-resources__links">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="technical-resources__link"
            onClick={() => setActiveItem(item)}
          >
            {item.title}
          </button>
        ))}
      </div>

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
