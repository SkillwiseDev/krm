"use client";

import Image from "next/image";
import { useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  addFaq,
  clearFaqsImage,
  removeFaq,
  saveFaqsImage,
  uploadServiceFaqsImage,
} from "@/app/admin/data-actions";
import type { Service } from "@/lib/admin-store";
import { MAX_SERVICE_FAQS } from "@/lib/service-limits";

type ServiceFaqsManagerProps = {
  services: Service[];
};

export default function ServiceFaqsManager({
  services,
}: ServiceFaqsManagerProps) {
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [imageUrl, setImageUrl] = useState(services[0]?.faqsImageUrl ?? "");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedService = useMemo(
    () => services.find((service) => service.id === serviceId) ?? null,
    [services, serviceId],
  );

  const faqCount = selectedService?.faqs.length ?? 0;
  const canAddFaq = faqCount < MAX_SERVICE_FAQS;

  function handleServiceChange(nextId: string) {
    setServiceId(nextId);
    const next = services.find((service) => service.id === nextId);
    setImageUrl(next?.faqsImageUrl ?? "");
    setUploadError(null);
    setQuestion("");
    setAnswer("");
  }

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
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
      const result = await uploadServiceFaqsImage(formData);

      if (!result.url) {
        setUploadError(result.error ?? "Image upload failed.");
        return;
      }

      setImageUrl(result.url);
    } finally {
      setIsUploading(false);
    }
  }

  if (services.length === 0) {
    return (
      <p className="admin-empty">
        Create a service first, then add FAQs under it.
      </p>
    );
  }

  return (
    <div className="admin-faqs-manager">
      <label>
        Service
        <select
          value={serviceId}
          onChange={(event) => handleServiceChange(event.target.value)}
        >
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.title}
            </option>
          ))}
        </select>
      </label>

      <article className="admin-card">
        <h2>FAQ Image (1 only)</h2>
        <form className="admin-form" action={saveFaqsImage}>
          <input type="hidden" name="serviceId" value={serviceId} />
          <input type="hidden" name="imageUrl" value={imageUrl} />

          <label>
            Upload image
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              onChange={handleImageChange}
              disabled={isUploading}
            />
          </label>

          {isUploading ? <p className="admin-empty">Uploading image…</p> : null}
          {uploadError ? (
            <p className="rich-text-editor__error" role="alert">
              {uploadError}
            </p>
          ) : null}

          {imageUrl ? (
            <div className="admin-faqs-manager__preview">
              <Image
                src={imageUrl}
                alt="FAQ section preview"
                width={180}
                height={180}
              />
            </div>
          ) : (
            <p className="admin-empty">No FAQ image set for this service.</p>
          )}

          <div className="admin-service-form__actions">
            <button type="submit" disabled={isUploading || !imageUrl}>
              Save Image
            </button>
          </div>
        </form>

        {selectedService?.faqsImageUrl ? (
          <form action={clearFaqsImage}>
            <input type="hidden" name="serviceId" value={serviceId} />
            <button
              className="admin-button admin-button--danger"
              type="submit"
            >
              Remove Image
            </button>
          </form>
        ) : null}
      </article>

      <article className="admin-card">
        <h2>
          FAQ Questions ({faqCount}/{MAX_SERVICE_FAQS})
        </h2>

        {canAddFaq ? (
          <form className="admin-form" action={addFaq}>
            <input type="hidden" name="serviceId" value={serviceId} />
            <label>
              Question
              <input
                type="text"
                name="question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Which laboratories is this product suitable for?"
                required
              />
            </label>
            <label>
              Answer
              <textarea
                name="answer"
                rows={4}
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Write the full answer shown when this FAQ is clicked."
                required
              />
            </label>
            <button type="submit">Add FAQ</button>
          </form>
        ) : (
          <p className="admin-empty">
            Maximum of {MAX_SERVICE_FAQS} FAQs reached for this service.
          </p>
        )}

        {selectedService && selectedService.faqs.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedService.faqs.map((faq, index) => (
                  <tr key={faq.id}>
                    <td>{index + 1}</td>
                    <td>{faq.question}</td>
                    <td>{faq.answer || "—"}</td>
                    <td>
                      <form action={removeFaq}>
                        <input
                          type="hidden"
                          name="serviceId"
                          value={serviceId}
                        />
                        <input type="hidden" name="faqId" value={faq.id} />
                        <button
                          className="admin-button admin-button--danger"
                          type="submit"
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="admin-empty">No FAQs added for this service yet.</p>
        )}
      </article>
    </div>
  );
}
