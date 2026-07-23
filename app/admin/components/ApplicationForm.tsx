"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import { uploadApplicationIcon } from "@/app/admin/data-actions";
import type { Service } from "@/lib/admin-store";

type ApplicationFormProps = {
  services: Service[];
  action: (formData: FormData) => void | Promise<void>;
};

export default function ApplicationForm({
  services,
  action,
}: ApplicationFormProps) {
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleIconChange(event: ChangeEvent<HTMLInputElement>) {
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
      const result = await uploadApplicationIcon(formData);

      if (!result.url) {
        setUploadError(result.error ?? "Icon upload failed.");
        return;
      }

      setIconUrl(result.url);
    } finally {
      setIsUploading(false);
    }
  }

  if (services.length === 0) {
    return (
      <p className="admin-empty">
        Create a service first, then add applications under it.
      </p>
    );
  }

  return (
    <form className="admin-form" action={action}>
      <input type="hidden" name="iconUrl" value={iconUrl} />

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
        Application title
        <input
          type="text"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Pathology Laboratories"
          required
        />
      </label>

      <label>
        Icon image
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          onChange={handleIconChange}
          disabled={isUploading}
        />
      </label>

      {isUploading ? <p className="admin-empty">Uploading icon…</p> : null}
      {uploadError ? (
        <p className="rich-text-editor__error" role="alert">
          {uploadError}
        </p>
      ) : null}

      {iconUrl ? (
        <div className="admin-application-form__preview">
          <Image
            src={iconUrl}
            alt="Application icon preview"
            width={96}
            height={96}
          />
          <button
            className="admin-button admin-button--ghost"
            type="button"
            onClick={() => setIconUrl("")}
          >
            Remove icon
          </button>
        </div>
      ) : null}

      <button type="submit" disabled={isUploading || !serviceId}>
        Save Application
      </button>
    </form>
  );
}
