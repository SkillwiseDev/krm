"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { uploadServiceDownloadPdf } from "@/app/admin/data-actions";
import type { Service } from "@/lib/admin-store";

type DownloadFormProps = {
  services: Service[];
  action: (formData: FormData) => void | Promise<void>;
};

export default function DownloadForm({ services, action }: DownloadFormProps) {
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handlePdfChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadServiceDownloadPdf(formData);

      if (!result.url) {
        setUploadError(result.error ?? "PDF upload failed.");
        return;
      }

      setFileUrl(result.url);
      setFileName(file.name);
    } finally {
      setIsUploading(false);
    }
  }

  if (services.length === 0) {
    return (
      <p className="admin-empty">
        Create a service first, then add downloads under it.
      </p>
    );
  }

  return (
    <form className="admin-form" action={action}>
      <input type="hidden" name="fileUrl" value={fileUrl} />

      <label>
        Service
        <select
          name="serviceId"
          value={serviceId}
          onChange={(event) => setServiceId(event.target.value)}
          required
        >
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.title}
            </option>
          ))}
        </select>
      </label>

      <label>
        Download title
        <input
          type="text"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Product Brochure"
          required
        />
      </label>

      <label>
        PDF file
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handlePdfChange}
          disabled={isUploading}
        />
      </label>

      {isUploading ? <p className="admin-empty">Uploading PDF…</p> : null}
      {uploadError ? (
        <p className="rich-text-editor__error" role="alert">
          {uploadError}
        </p>
      ) : null}

      {fileUrl ? (
        <div className="admin-download-form__preview">
          <a href={fileUrl} target="_blank" rel="noreferrer">
            {fileName || fileUrl}
          </a>
          <button
            className="admin-button admin-button--ghost"
            type="button"
            onClick={() => {
              setFileUrl("");
              setFileName("");
            }}
          >
            Remove PDF
          </button>
        </div>
      ) : null}

      <button type="submit" disabled={isUploading || !serviceId || !fileUrl}>
        Save Download
      </button>
    </form>
  );
}
