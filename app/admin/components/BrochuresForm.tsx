"use client";

import { useState, type ChangeEvent } from "react";
import {
  saveProductBrochuresAction,
  uploadProductBrochurePdf,
} from "@/app/admin/brochures-actions";
import type {
  ProductBrochureItem,
  ProductBrochures,
} from "@/lib/product-brochures-store";

type BrochuresFormProps = {
  initial: ProductBrochures;
};

function emptyItem(): ProductBrochureItem {
  return {
    id: crypto.randomUUID(),
    title: "",
    fileUrl: undefined,
  };
}

export default function BrochuresForm({ initial }: BrochuresFormProps) {
  const [title, setTitle] = useState(initial.title);
  const [items, setItems] = useState<ProductBrochureItem[]>(
    initial.items.length > 0 ? initial.items : [emptyItem()],
  );
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});

  const isBusy = uploadingId !== null;

  function updateItem(id: string, value: string) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, title: value } : item,
      ),
    );
  }

  async function handlePdfChange(
    itemId: string,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setFileErrors((current) => {
      const next = { ...current };
      delete next[itemId];
      return next;
    });
    setUploadingId(itemId);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadProductBrochurePdf(formData);

      if (!result.url) {
        setFileErrors((current) => ({
          ...current,
          [itemId]: result.error ?? "PDF upload failed.",
        }));
        return;
      }

      setItems((current) =>
        current.map((item) =>
          item.id === itemId ? { ...item, fileUrl: result.url } : item,
        ),
      );
    } finally {
      setUploadingId(null);
    }
  }

  return (
    <form
      className="admin-form admin-certifications-form"
      action={saveProductBrochuresAction}
    >
      <input type="hidden" name="items" value={JSON.stringify(items)} />

      <article className="admin-card">
        <h2>Section</h2>
        <label>
          Page title
          <input
            type="text"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Product Brochures"
            required
          />
        </label>
      </article>

      <article className="admin-card admin-card--wide">
        <div className="admin-service-form__section-header">
          <h2>Brochures ({items.length})</h2>
          <button
            className="admin-button admin-button--ghost"
            type="button"
            onClick={() => setItems((current) => [...current, emptyItem()])}
          >
            Add brochure
          </button>
        </div>
        <p className="admin-empty">
          Add brochure title and PDF. These appear on the Product Brochures
          page.
        </p>

        <div className="admin-certifications-form__items">
          {items.map((item, index) => (
            <div className="admin-certifications-form__item" key={item.id}>
              <h3>Brochure {index + 1}</h3>

              <label>
                Title
                <input
                  type="text"
                  value={item.title}
                  onChange={(event) => updateItem(item.id, event.target.value)}
                  placeholder="ChemoScan Brochure"
                  required
                />
              </label>

              <label>
                PDF file
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(event) => handlePdfChange(item.id, event)}
                  disabled={isBusy}
                />
              </label>
              {uploadingId === item.id ? (
                <p className="admin-empty">Uploading PDF…</p>
              ) : null}
              {fileErrors[item.id] ? (
                <p className="rich-text-editor__error" role="alert">
                  {fileErrors[item.id]}
                </p>
              ) : null}
              {item.fileUrl ? (
                <div className="admin-certifications-form__file">
                  <a href={item.fileUrl} target="_blank" rel="noreferrer">
                    {item.fileUrl}
                  </a>
                  <button
                    className="admin-button admin-button--ghost"
                    type="button"
                    onClick={() =>
                      setItems((current) =>
                        current.map((entry) =>
                          entry.id === item.id
                            ? { ...entry, fileUrl: undefined }
                            : entry,
                        ),
                      )
                    }
                  >
                    Remove PDF
                  </button>
                </div>
              ) : null}

              <button
                className="admin-button admin-button--danger"
                type="button"
                onClick={() =>
                  setItems((current) =>
                    current.length > 1
                      ? current.filter((entry) => entry.id !== item.id)
                      : current,
                  )
                }
                disabled={items.length <= 1}
              >
                Remove brochure
              </button>
            </div>
          ))}
        </div>
      </article>

      <div className="admin-service-form__actions">
        <button type="submit" disabled={isBusy}>
          Save Product Brochures
        </button>
      </div>
    </form>
  );
}
