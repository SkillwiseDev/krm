"use client";

import { useState, type ChangeEvent } from "react";
import {
  saveTechnicalResourcesAction,
  uploadTechnicalResourcePdf,
} from "@/app/admin/technical-resources-actions";
import type { TechnicalResourceItem } from "@/lib/technical-resources-store";

type TechnicalResourcesFormProps = {
  initialItems: TechnicalResourceItem[];
};

export default function TechnicalResourcesForm({
  initialItems,
}: TechnicalResourcesFormProps) {
  const [items, setItems] = useState<TechnicalResourceItem[]>(initialItems);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});

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
      const result = await uploadTechnicalResourcePdf(formData);

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

  function updateItem(
    index: number,
    field: "title" | "content",
    value: string,
  ) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  }

  return (
    <form
      className="admin-form admin-resources-form"
      action={saveTechnicalResourcesAction}
    >
      <input type="hidden" name="items" value={JSON.stringify(items)} />

      <article className="admin-card admin-card--wide">
        <h2>Technical Resources</h2>
        <p className="admin-empty">
          Update content and upload a PDF for each resource. PDFs are saved to
          the public downloads folder and served after the user submits name,
          email, and phone on the Services page.
        </p>

        <div className="admin-resources-form__links">
          {items.map((item, index) => (
            <div className="admin-resources-form__link" key={item.id}>
              <label>
                Title
                <input
                  type="text"
                  value={item.title}
                  onChange={(event) =>
                    updateItem(index, "title", event.target.value)
                  }
                  required
                />
              </label>

              <label>
                Content / description
                <textarea
                  value={item.content}
                  onChange={(event) =>
                    updateItem(index, "content", event.target.value)
                  }
                  rows={4}
                  placeholder="Short description shown before download"
                />
              </label>

              <label>
                PDF file
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(event) => handlePdfChange(item.id, event)}
                  disabled={uploadingId !== null}
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
                <div className="admin-resources-form__file">
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
                    Remove file
                  </button>
                </div>
              ) : (
                <p className="admin-empty">No PDF uploaded yet.</p>
              )}
            </div>
          ))}
        </div>
      </article>

      <div className="admin-service-form__actions">
        <button type="submit" disabled={uploadingId !== null}>
          Save Technical Resources
        </button>
      </div>
    </form>
  );
}
