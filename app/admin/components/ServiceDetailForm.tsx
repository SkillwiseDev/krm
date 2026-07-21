"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadServiceHeroImage } from "@/app/admin/data-actions";
import type {
  Service,
  ServiceCategory,
  ServiceFeatureSection,
  ServiceSpecification,
} from "@/lib/admin-store";
import { HEMOSCAN_SAMPLE } from "@/lib/service-content";

type ServiceDetailFormProps = {
  categories: ServiceCategory[];
  initialService?: Service;
  action: (formData: FormData) => void | Promise<void>;
};

const emptyFeatureSection = (): ServiceFeatureSection => ({
  title: "",
  items: [""],
});

const emptySpecification = (): ServiceSpecification => ({
  label: "",
  detail: "",
});

export default function ServiceDetailForm({
  categories,
  initialService,
  action,
}: ServiceDetailFormProps) {
  const [categoryId, setCategoryId] = useState(initialService?.categoryId ?? "");
  const [title, setTitle] = useState(initialService?.title ?? "");
  const [tagline, setTagline] = useState(initialService?.tagline ?? "");
  const [summary, setSummary] = useState(initialService?.summary ?? "");
  const [overview, setOverview] = useState(initialService?.overview ?? "");
  const [featureSections, setFeatureSections] = useState<ServiceFeatureSection[]>(
    initialService?.featureSections.length
      ? initialService.featureSections
      : [emptyFeatureSection()],
  );
  const [specifications, setSpecifications] = useState<ServiceSpecification[]>(
    initialService?.specifications.length
      ? initialService.specifications
      : [emptySpecification()],
  );
  const [advantageTitle, setAdvantageTitle] = useState(
    initialService?.advantageTitle ?? "",
  );
  const [advantageContent, setAdvantageContent] = useState(
    initialService?.advantageContent ?? "",
  );
  const [closingTitle, setClosingTitle] = useState(
    initialService?.closingTitle ?? "",
  );
  const [closingDescription, setClosingDescription] = useState(
    initialService?.closingDescription ?? "",
  );
  const [heroImageUrl, setHeroImageUrl] = useState(
    initialService?.heroImageUrl ?? "",
  );
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [heroUploadError, setHeroUploadError] = useState<string | null>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  function loadSample() {
    setTitle(HEMOSCAN_SAMPLE.title);
    setTagline(HEMOSCAN_SAMPLE.tagline);
    setSummary(HEMOSCAN_SAMPLE.summary);
    setOverview(HEMOSCAN_SAMPLE.overview);
    setFeatureSections(HEMOSCAN_SAMPLE.featureSections);
    setSpecifications(HEMOSCAN_SAMPLE.specifications);
    setAdvantageTitle(HEMOSCAN_SAMPLE.advantageTitle);
    setAdvantageContent(HEMOSCAN_SAMPLE.advantageContent);
    setClosingTitle(HEMOSCAN_SAMPLE.closingTitle);
    setClosingDescription(HEMOSCAN_SAMPLE.closingDescription);
  }

  function updateFeatureSectionTitle(index: number, value: string) {
    setFeatureSections((sections) =>
      sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, title: value } : section,
      ),
    );
  }

  function updateFeatureSectionItems(index: number, value: string) {
    setFeatureSections((sections) =>
      sections.map((section, sectionIndex) =>
        sectionIndex === index
          ? { ...section, items: value.split("\n") }
          : section,
      ),
    );
  }

  function updateSpecification(
    index: number,
    field: keyof ServiceSpecification,
    value: string,
  ) {
    setSpecifications((rows) =>
      rows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    );
  }

  async function handleHeroImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setHeroUploadError(null);
    setIsUploadingHero(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadServiceHeroImage(formData);

      if (!result.url) {
        setHeroUploadError(result.error ?? "Hero image upload failed.");
        return;
      }

      setHeroImageUrl(result.url);
    } finally {
      setIsUploadingHero(false);
    }
  }

  return (
    <form className="admin-form admin-service-form" action={action}>
      {initialService ? (
        <input type="hidden" name="id" value={initialService.id} />
      ) : null}
      <input type="hidden" name="categoryId" value={categoryId} />
      <input type="hidden" name="heroImageUrl" value={heroImageUrl} />
      <input
        type="hidden"
        name="featureSections"
        value={JSON.stringify(
          featureSections
            .map((section) => ({
              title: section.title.trim(),
              items: section.items.map((item) => item.trim()).filter(Boolean),
            }))
            .filter((section) => section.title || section.items.length > 0),
        )}
      />
      <input
        type="hidden"
        name="specifications"
        value={JSON.stringify(
          specifications.filter((row) => row.label.trim() || row.detail.trim()),
        )}
      />

      <div className="admin-service-form__toolbar">
        <button className="admin-button admin-button--ghost" type="button" onClick={loadSample}>
          Load HemoScan sample
        </button>
      </div>

      <article className="admin-card">
        <h2>Basic Details</h2>
        <label>
          Category (optional)
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Service title
          <input
            type="text"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="HemoScan 3000 – Fully Automated 3-Part Hematology Analyzer"
            required
          />
        </label>
        <label>
          Tagline
          <input
            type="text"
            name="tagline"
            value={tagline}
            onChange={(event) => setTagline(event.target.value)}
            placeholder="Global Equipment Quality at Local Prices"
            required
          />
        </label>
        <label>
          Short summary
          <input
            type="text"
            name="summary"
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            placeholder="Short line for admin list view"
          />
        </label>
      </article>

      <article className="admin-card">
        <h2>Hero Section Image (optional)</h2>
        <p className="admin-service-form__help">
          Upload a banner image for the service hero section. Saved to Cloudinary.
        </p>
        <input
          ref={heroFileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="sr-only"
          onChange={handleHeroImageChange}
        />
        <div className="admin-hero-upload">
          {heroImageUrl ? (
            <div className="admin-hero-upload__preview">
              <Image
                src={heroImageUrl}
                alt="Service hero preview"
                width={960}
                height={420}
              />
            </div>
          ) : (
            <div className="admin-hero-upload__empty">
              No hero image selected yet.
            </div>
          )}
          <div className="admin-hero-upload__actions">
            <button
              className="admin-button admin-button--ghost"
              type="button"
              disabled={isUploadingHero}
              onClick={() => heroFileInputRef.current?.click()}
            >
              {isUploadingHero ? "Uploading..." : "Upload Hero Image"}
            </button>
            {heroImageUrl ? (
              <button
                className="admin-button admin-button--danger"
                type="button"
                onClick={() => {
                  setHeroImageUrl("");
                  setHeroUploadError(null);
                }}
              >
                Remove Image
              </button>
            ) : null}
          </div>
        </div>
        {heroUploadError ? (
          <p className="rich-text-editor__error" role="alert">
            {heroUploadError}
          </p>
        ) : null}
      </article>

      <article className="admin-card">
        <h2>Product Overview</h2>
        <label>
          Overview content
          <textarea
            name="overview"
            rows={8}
            value={overview}
            onChange={(event) => setOverview(event.target.value)}
            placeholder="Write product overview paragraphs. Separate paragraphs with a blank line."
          />
        </label>
      </article>

      <article className="admin-card">
        <div className="admin-service-form__section-header">
          <h2>Key Features & Business Benefits</h2>
          <button
            className="admin-button admin-button--ghost"
            type="button"
            onClick={() =>
              setFeatureSections((sections) => [...sections, emptyFeatureSection()])
            }
          >
            Add section
          </button>
        </div>

        {featureSections.map((section, index) => (
          <div className="admin-service-form__group" key={`feature-${index}`}>
            <label>
              Section title
              <input
                type="text"
                value={section.title}
                onChange={(event) =>
                  updateFeatureSectionTitle(index, event.target.value)
                }
                placeholder="High Efficiency & Speed"
              />
            </label>
            <label>
              Bullet points (one per line)
              <textarea
                rows={4}
                value={section.items.join("\n")}
                onChange={(event) =>
                  updateFeatureSectionItems(index, event.target.value)
                }
                placeholder={"60 Samples/Hour: ...\nOne-Click Workflows: ..."}
              />
            </label>
            {featureSections.length > 1 ? (
              <button
                className="admin-button admin-button--danger"
                type="button"
                onClick={() =>
                  setFeatureSections((sections) =>
                    sections.filter((_, sectionIndex) => sectionIndex !== index),
                  )
                }
              >
                Remove section
              </button>
            ) : null}
          </div>
        ))}
      </article>

      <article className="admin-card">
        <div className="admin-service-form__section-header">
          <h2>Technical Specifications</h2>
          <button
            className="admin-button admin-button--ghost"
            type="button"
            onClick={() =>
              setSpecifications((rows) => [...rows, emptySpecification()])
            }
          >
            Add row
          </button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table admin-table--form">
            <thead>
              <tr>
                <th>Feature / Specification</th>
                <th>Product Detail</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {specifications.map((row, index) => (
                <tr key={`spec-${index}`}>
                  <td>
                    <input
                      type="text"
                      value={row.label}
                      onChange={(event) =>
                        updateSpecification(index, "label", event.target.value)
                      }
                      placeholder="Measurement Principles"
                    />
                  </td>
                  <td>
                    <textarea
                      rows={3}
                      value={row.detail}
                      onChange={(event) =>
                        updateSpecification(index, "detail", event.target.value)
                      }
                      placeholder="Electrical impedance for WBC, RBC, and PLT counting..."
                    />
                  </td>
                  <td>
                    {specifications.length > 1 ? (
                      <button
                        className="admin-button admin-button--danger"
                        type="button"
                        onClick={() =>
                          setSpecifications((rows) =>
                            rows.filter((_, rowIndex) => rowIndex !== index),
                          )
                        }
                      >
                        Remove
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="admin-card">
        <h2>The KRM Healthcare Advantage</h2>
        <label>
          Section title
          <input
            type="text"
            name="advantageTitle"
            value={advantageTitle}
            onChange={(event) => setAdvantageTitle(event.target.value)}
            placeholder="The KRM Healthcare Advantage"
          />
        </label>
        <label>
          Content
          <textarea
            name="advantageContent"
            rows={5}
            value={advantageContent}
            onChange={(event) => setAdvantageContent(event.target.value)}
          />
        </label>
      </article>

      <article className="admin-card">
        <h2>Closing Section</h2>
        <label>
          Closing title
          <input
            type="text"
            name="closingTitle"
            value={closingTitle}
            onChange={(event) => setClosingTitle(event.target.value)}
            placeholder="Optimize Your Diagnostics Portfolio Today"
          />
        </label>
        <label>
          Closing description
          <textarea
            name="closingDescription"
            rows={3}
            value={closingDescription}
            onChange={(event) => setClosingDescription(event.target.value)}
          />
        </label>
      </article>

      <div className="admin-service-form__actions">
        <button type="submit">
          {initialService ? "Update Service Details" : "Save Service Details"}
        </button>
      </div>
    </form>
  );
}
