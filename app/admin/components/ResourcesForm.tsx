"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import {
  saveHomeResources,
  uploadResourceFile,
  uploadResourcesImage,
} from "@/app/admin/resources-actions";
import type { SiteResourceLink, SiteResources } from "@/lib/site-resources-store";

type ResourcesFormProps = {
  initial: SiteResources;
};

function emptyLink(): SiteResourceLink {
  return {
    id: crypto.randomUUID(),
    title: "",
    href: "",
    fileUrl: undefined,
  };
}

export default function ResourcesForm({ initial }: ResourcesFormProps) {
  const [title, setTitle] = useState(initial.title);
  const [imageUrl, setImageUrl] = useState(initial.imageUrl ?? "");
  const [links, setLinks] = useState<SiteResourceLink[]>(
    initial.links.length > 0 ? initial.links : [emptyLink()],
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadingLinkId, setUploadingLinkId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isBusy = isUploadingImage || uploadingLinkId !== null;

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setUploadError(null);
    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadResourcesImage(formData);

      if (!result.url) {
        setUploadError(result.error ?? "Image upload failed.");
        return;
      }

      setImageUrl(result.url);
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function handleLinkFileChange(
    linkId: string,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setFileErrors((current) => {
      const next = { ...current };
      delete next[linkId];
      return next;
    });
    setUploadingLinkId(linkId);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadResourceFile(formData);

      if (!result.url) {
        setFileErrors((current) => ({
          ...current,
          [linkId]: result.error ?? "PDF upload failed.",
        }));
        return;
      }

      setLinks((current) =>
        current.map((link) =>
          link.id === linkId ? { ...link, fileUrl: result.url } : link,
        ),
      );
    } finally {
      setUploadingLinkId(null);
    }
  }

  function updateLink(
    index: number,
    field: keyof SiteResourceLink,
    value: string,
  ) {
    setLinks((current) =>
      current.map((link, linkIndex) =>
        linkIndex === index ? { ...link, [field]: value } : link,
      ),
    );
  }

  return (
    <form className="admin-form admin-resources-form" action={saveHomeResources}>
      <input type="hidden" name="imageUrl" value={imageUrl} />
      <input type="hidden" name="links" value={JSON.stringify(links)} />

      <article className="admin-card">
        <h2>Section</h2>
        <label>
          Heading
          <input
            type="text"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Resources & Downloads"
            required
          />
        </label>
      </article>

      <article className="admin-card">
        <h2>Side Image</h2>
        <label>
          Upload image
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            onChange={handleImageChange}
            disabled={isBusy}
          />
        </label>

        {isUploadingImage ? (
          <p className="admin-empty">Uploading image…</p>
        ) : null}
        {uploadError ? (
          <p className="rich-text-editor__error" role="alert">
            {uploadError}
          </p>
        ) : null}

        {imageUrl ? (
          <div className="admin-resources-form__preview">
            <Image
              src={imageUrl}
              alt="Resources section preview"
              width={240}
              height={180}
            />
            <button
              className="admin-button admin-button--ghost"
              type="button"
              onClick={() => setImageUrl("")}
            >
              Remove image
            </button>
          </div>
        ) : (
          <p className="admin-empty">
            No custom image set. Homepage will use the default image.
          </p>
        )}
      </article>

      <article className="admin-card admin-card--wide">
        <div className="admin-service-form__section-header">
          <h2>Links</h2>
          <button
            className="admin-button admin-button--ghost"
            type="button"
            onClick={() => setLinks((current) => [...current, emptyLink()])}
          >
            Add link
          </button>
        </div>

        <p className="admin-empty">
          Optional: upload a PDF for a link. If uploaded, homepage click will
          download that file instead of opening the URL.
        </p>

        <div className="admin-resources-form__links">
          {links.map((link, index) => (
            <div className="admin-resources-form__link" key={link.id}>
              <label>
                Label
                <input
                  type="text"
                  value={link.title}
                  onChange={(event) =>
                    updateLink(index, "title", event.target.value)
                  }
                  placeholder="Product Brochures"
                  required
                />
              </label>
              <label>
                Link URL (used if no file)
                <input
                  type="text"
                  value={link.href}
                  onChange={(event) =>
                    updateLink(index, "href", event.target.value)
                  }
                  placeholder="/services or https://..."
                />
              </label>
              <label>
                Download file (optional PDF)
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(event) => handleLinkFileChange(link.id, event)}
                  disabled={isBusy}
                />
              </label>

              {uploadingLinkId === link.id ? (
                <p className="admin-empty">Uploading PDF…</p>
              ) : null}
              {fileErrors[link.id] ? (
                <p className="rich-text-editor__error" role="alert">
                  {fileErrors[link.id]}
                </p>
              ) : null}

              {link.fileUrl ? (
                <div className="admin-resources-form__file">
                  <a href={link.fileUrl} target="_blank" rel="noreferrer">
                    {link.fileUrl}
                  </a>
                  <button
                    className="admin-button admin-button--ghost"
                    type="button"
                    onClick={() =>
                      setLinks((current) =>
                        current.map((item) =>
                          item.id === link.id
                            ? { ...item, fileUrl: undefined }
                            : item,
                        ),
                      )
                    }
                  >
                    Remove file
                  </button>
                </div>
              ) : null}

              <button
                className="admin-button admin-button--danger"
                type="button"
                onClick={() =>
                  setLinks((current) =>
                    current.length > 1
                      ? current.filter((_, i) => i !== index)
                      : current,
                  )
                }
                disabled={links.length <= 1}
              >
                Remove link
              </button>
            </div>
          ))}
        </div>
      </article>

      <div className="admin-service-form__actions">
        <button type="submit" disabled={isBusy}>
          Save Resources Section
        </button>
      </div>
    </form>
  );
}
