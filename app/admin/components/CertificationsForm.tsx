"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import {
  saveHomeCertifications,
  uploadCertificationsFile,
  uploadCertificationsImage,
} from "@/app/admin/certifications-actions";
import type {
  SiteCertificationItem,
  SiteCertifications,
} from "@/lib/site-certifications-store";

type CertificationsFormProps = {
  initial: SiteCertifications;
};

function emptyItem(): SiteCertificationItem {
  return {
    id: crypto.randomUUID(),
    cardTitle: "",
    cardDescription: "",
    imageUrl: undefined,
    fileUrl: undefined,
  };
}

export default function CertificationsForm({
  initial,
}: CertificationsFormProps) {
  const [title, setTitle] = useState(initial.title);
  const [items, setItems] = useState<SiteCertificationItem[]>(
    initial.items.length > 0 ? initial.items : [emptyItem()],
  );
  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);
  const [uploadingFileId, setUploadingFileId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, string>>({});
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});

  const isBusy = uploadingImageId !== null || uploadingFileId !== null;

  function updateItem(
    id: string,
    field: keyof SiteCertificationItem,
    value: string,
  ) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  }

  async function handleImageChange(
    itemId: string,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setImageErrors((current) => {
      const next = { ...current };
      delete next[itemId];
      return next;
    });
    setUploadingImageId(itemId);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadCertificationsImage(formData);

      if (!result.url) {
        setImageErrors((current) => ({
          ...current,
          [itemId]: result.error ?? "Image upload failed.",
        }));
        return;
      }

      setItems((current) =>
        current.map((item) =>
          item.id === itemId ? { ...item, imageUrl: result.url } : item,
        ),
      );
    } finally {
      setUploadingImageId(null);
    }
  }

  async function handleFileChange(
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
    setUploadingFileId(itemId);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadCertificationsFile(formData);

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
      setUploadingFileId(null);
    }
  }

  return (
    <form
      className="admin-form admin-certifications-form"
      action={saveHomeCertifications}
    >
      <input type="hidden" name="items" value={JSON.stringify(items)} />

      <article className="admin-card">
        <h2>Section</h2>
        <label>
          Section title
          <input
            type="text"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Trust & Certifications"
            required
          />
        </label>
      </article>

      <article className="admin-card admin-card--wide">
        <div className="admin-service-form__section-header">
          <h2>Certificates ({items.length})</h2>
          <button
            className="admin-button admin-button--ghost"
            type="button"
            onClick={() => setItems((current) => [...current, emptyItem()])}
          >
            Add certificate
          </button>
        </div>
        <p className="admin-empty">
          Add multiple certificates. On the homepage they fade between each
          other automatically.
        </p>

        <div className="admin-certifications-form__items">
          {items.map((item, index) => (
            <div className="admin-certifications-form__item" key={item.id}>
              <h3>Certificate {index + 1}</h3>

              <label>
                Card title
                <input
                  type="text"
                  value={item.cardTitle}
                  onChange={(event) =>
                    updateItem(item.id, "cardTitle", event.target.value)
                  }
                  placeholder="ISO & CE Standards"
                  required
                />
              </label>

              <label>
                Card description
                <textarea
                  rows={3}
                  value={item.cardDescription}
                  onChange={(event) =>
                    updateItem(item.id, "cardDescription", event.target.value)
                  }
                  placeholder="Products are manufactured following international quality standards."
                  required
                />
              </label>

              <label>
                Certificate image (optional)
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  onChange={(event) => handleImageChange(item.id, event)}
                  disabled={isBusy}
                />
              </label>
              {uploadingImageId === item.id ? (
                <p className="admin-empty">Uploading image…</p>
              ) : null}
              {imageErrors[item.id] ? (
                <p className="rich-text-editor__error" role="alert">
                  {imageErrors[item.id]}
                </p>
              ) : null}
              {item.imageUrl ? (
                <div className="admin-certifications-form__preview">
                  <Image
                    src={item.imageUrl}
                    alt=""
                    width={160}
                    height={200}
                  />
                  <button
                    className="admin-button admin-button--ghost"
                    type="button"
                    onClick={() =>
                      setItems((current) =>
                        current.map((entry) =>
                          entry.id === item.id
                            ? { ...entry, imageUrl: undefined }
                            : entry,
                        ),
                      )
                    }
                  >
                    Use default image
                  </button>
                </div>
              ) : null}

              <label>
                Downloadable PDF (optional)
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(event) => handleFileChange(item.id, event)}
                  disabled={isBusy}
                />
              </label>
              {uploadingFileId === item.id ? (
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
                Remove certificate
              </button>
            </div>
          ))}
        </div>
      </article>

      <div className="admin-service-form__actions">
        <button type="submit" disabled={isBusy}>
          Save Certifications Section
        </button>
      </div>
    </form>
  );
}
