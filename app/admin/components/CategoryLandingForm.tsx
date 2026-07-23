"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  saveServiceCategory,
  uploadCategoryHeroImage,
} from "@/app/admin/data-actions";
import type { ServiceCategory } from "@/lib/admin-store";
import type {
  CategoryCta,
  CategoryLandingSection,
  CategoryProductHighlight,
} from "@/lib/category-landing";
import { getStaticCategoryLanding } from "@/lib/category-landing-resolve";

type CategoryLandingFormProps = {
  category: ServiceCategory;
};

const SECTION_TYPES: CategoryLandingSection["type"][] = [
  "intro",
  "heading",
  "subheading",
  "paragraphs",
  "bullets",
  "advantages",
  "productGrid",
  "table",
  "cta",
  "closing",
];

function createEmptySection(
  type: CategoryLandingSection["type"] = "heading",
): CategoryLandingSection {
  switch (type) {
    case "intro":
    case "paragraphs":
      return { type, paragraphs: [""] };
    case "heading":
    case "subheading":
      return { type, text: "" };
    case "bullets":
      return { type, items: [""] };
    case "advantages":
      return { type, title: "", items: [{ title: "", body: "" }] };
    case "productGrid":
      return { type, products: [] };
    case "table":
      return { type, title: "", headers: [], rows: [] };
    case "cta":
      return { type, cta: { label: "", requirement: "", formName: "" } };
    case "closing":
      return { type, title: "", paragraphs: [""] };
  }
}

function paragraphsToText(paragraphs: string[]): string {
  return paragraphs.join("\n\n");
}

function textToParagraphs(value: string): string[] {
  return value.split(/\n\s*\n/);
}

function advantagesToText(
  items: { title: string; body: string }[],
): string {
  return items
    .map((item) => `${item.title}::${item.body}`)
    .join("\n");
}

function textToAdvantages(value: string): { title: string; body: string }[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf("::");
      if (separator === -1) {
        return { title: line, body: "" };
      }
      return {
        title: line.slice(0, separator).trim(),
        body: line.slice(separator + 2).trim(),
      };
    });
}

function tableRowsToText(rows: string[][]): string {
  return rows.map((row) => row.join("|")).join("\n");
}

function textToTableRows(value: string): string[][] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split("|").map((cell) => cell.trim()));
}

function isProductHighlight(value: unknown): value is CategoryProductHighlight {
  if (!value || typeof value !== "object") {
    return false;
  }

  const product = value as CategoryProductHighlight;
  return (
    typeof product.title === "string" &&
    Array.isArray(product.points) &&
    product.points.every((point) => typeof point === "string")
  );
}

function ProductGridField({
  products,
  onChange,
}: {
  products: CategoryProductHighlight[];
  onChange: (products: CategoryProductHighlight[]) => void;
}) {
  const [draft, setDraft] = useState(() =>
    JSON.stringify(products, null, 2),
  );
  const [error, setError] = useState<string | null>(null);

  function handleBlur() {
    try {
      const parsed = JSON.parse(draft) as unknown;
      if (!Array.isArray(parsed) || !parsed.every(isProductHighlight)) {
        setError("Must be a JSON array of products with title and points[].");
        return;
      }
      setError(null);
      onChange(parsed);
      setDraft(JSON.stringify(parsed, null, 2));
    } catch {
      setError("Invalid JSON. Fix the array before saving.");
    }
  }

  return (
    <label>
      Products (JSON array)
      <textarea
        rows={10}
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          setError(null);
        }}
        onBlur={handleBlur}
        spellCheck={false}
      />
      {error ? (
        <p className="rich-text-editor__error" role="alert">
          {error}
        </p>
      ) : null}
    </label>
  );
}

function CtaFields({
  cta,
  onChange,
  optional,
}: {
  cta: CategoryCta;
  onChange: (cta: CategoryCta) => void;
  optional?: boolean;
}) {
  return (
    <>
      <label>
        CTA label{optional ? " (optional)" : ""}
        <input
          type="text"
          value={cta.label}
          onChange={(event) =>
            onChange({ ...cta, label: event.target.value })
          }
          placeholder="Request a Quote"
        />
      </label>
      <label>
        CTA requirement{optional ? " (optional)" : ""}
        <input
          type="text"
          value={cta.requirement}
          onChange={(event) =>
            onChange({ ...cta, requirement: event.target.value })
          }
          placeholder="HemoScan 3000 Quote / Demo"
        />
      </label>
      <label>
        Form name{optional ? " (optional)" : ""}
        <input
          type="text"
          value={cta.formName ?? ""}
          onChange={(event) =>
            onChange({ ...cta, formName: event.target.value })
          }
          placeholder="Category Enquiry"
        />
      </label>
    </>
  );
}

export default function CategoryLandingForm({
  category,
}: CategoryLandingFormProps) {
  const staticLanding = getStaticCategoryLanding(category.slug);

  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description ?? "");
  const [landingTitle, setLandingTitle] = useState(
    category.landing?.title || staticLanding?.title || category.name,
  );
  const [landingTagline, setLandingTagline] = useState(
    category.landing?.tagline || staticLanding?.tagline || "",
  );
  const [sections, setSections] = useState<CategoryLandingSection[]>(() => {
    if (category.landing?.sections?.length) {
      return category.landing.sections;
    }
    return staticLanding?.sections ?? [];
  });
  const [heroImageUrl, setHeroImageUrl] = useState(category.heroImageUrl ?? "");
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [heroUploadError, setHeroUploadError] = useState<string | null>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  function loadDefaultContent() {
    const landing = getStaticCategoryLanding(category.slug);
    if (!landing) {
      return;
    }

    setLandingTitle(landing.title);
    setLandingTagline(landing.tagline);
    setSections(landing.sections);
  }

  function updateSection(index: number, next: CategoryLandingSection) {
    setSections((current) =>
      current.map((section, sectionIndex) =>
        sectionIndex === index ? next : section,
      ),
    );
  }

  function changeSectionType(
    index: number,
    type: CategoryLandingSection["type"],
  ) {
    updateSection(index, createEmptySection(type));
  }

  function moveSection(index: number, direction: -1 | 1) {
    setSections((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) {
        return current;
      }

      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
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
      const result = await uploadCategoryHeroImage(formData);

      if (!result.url) {
        setHeroUploadError(result.error ?? "Hero image upload failed.");
        return;
      }

      setHeroImageUrl(result.url);
    } finally {
      setIsUploadingHero(false);
    }
  }

  function renderSectionFields(
    section: CategoryLandingSection,
    index: number,
  ) {
    switch (section.type) {
      case "intro":
      case "paragraphs":
        return (
          <label>
            Paragraphs (separate with a blank line)
            <textarea
              rows={6}
              value={paragraphsToText(section.paragraphs)}
              onChange={(event) =>
                updateSection(index, {
                  ...section,
                  paragraphs: textToParagraphs(event.target.value),
                })
              }
            />
          </label>
        );
      case "heading":
      case "subheading":
        return (
          <label>
            Text
            <input
              type="text"
              value={section.text}
              onChange={(event) =>
                updateSection(index, {
                  ...section,
                  text: event.target.value,
                })
              }
            />
          </label>
        );
      case "bullets":
        return (
          <label>
            Items (one per line)
            <textarea
              rows={5}
              value={section.items.join("\n")}
              onChange={(event) =>
                updateSection(index, {
                  ...section,
                  items: event.target.value.split("\n"),
                })
              }
            />
          </label>
        );
      case "advantages":
        return (
          <>
            <label>
              Title
              <input
                type="text"
                value={section.title}
                onChange={(event) =>
                  updateSection(index, {
                    ...section,
                    title: event.target.value,
                  })
                }
              />
            </label>
            <label>
              Items (Title::Body, one per line)
              <textarea
                rows={6}
                value={advantagesToText(section.items)}
                onChange={(event) =>
                  updateSection(index, {
                    ...section,
                    items: textToAdvantages(event.target.value),
                  })
                }
                placeholder={"Domestic Supply::No import delays\nValue::..."}
              />
            </label>
          </>
        );
      case "table":
        return (
          <>
            <label>
              Table title (optional)
              <input
                type="text"
                value={section.title ?? ""}
                onChange={(event) =>
                  updateSection(index, {
                    ...section,
                    title: event.target.value,
                  })
                }
              />
            </label>
            <label>
              Headers (comma-separated)
              <input
                type="text"
                value={section.headers.join(", ")}
                onChange={(event) =>
                  updateSection(index, {
                    ...section,
                    headers: event.target.value
                      .split(",")
                      .map((header) => header.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="Feature, Detail"
              />
            </label>
            <label>
              Rows (pipe-separated columns, one row per line)
              <textarea
                rows={5}
                value={tableRowsToText(section.rows)}
                onChange={(event) =>
                  updateSection(index, {
                    ...section,
                    rows: textToTableRows(event.target.value),
                  })
                }
                placeholder={"Throughput|60 samples/hour\nSample|9 µL"}
              />
            </label>
          </>
        );
      case "cta":
        return (
          <CtaFields
            cta={section.cta}
            onChange={(cta) => updateSection(index, { ...section, cta })}
          />
        );
      case "closing":
        return (
          <>
            <label>
              Title
              <input
                type="text"
                value={section.title}
                onChange={(event) =>
                  updateSection(index, {
                    ...section,
                    title: event.target.value,
                  })
                }
              />
            </label>
            <label>
              Paragraphs (separate with a blank line)
              <textarea
                rows={5}
                value={paragraphsToText(section.paragraphs)}
                onChange={(event) =>
                  updateSection(index, {
                    ...section,
                    paragraphs: textToParagraphs(event.target.value),
                  })
                }
              />
            </label>
            <CtaFields
              optional
              cta={
                section.cta ?? {
                  label: "",
                  requirement: "",
                  formName: "",
                }
              }
              onChange={(cta) => {
                const hasCta = cta.label.trim() || cta.requirement.trim() || cta.formName?.trim();
                updateSection(index, {
                  ...section,
                  cta: hasCta ? cta : undefined,
                });
              }}
            />
          </>
        );
      case "productGrid":
        return (
          <ProductGridField
            key={`product-grid-${index}-${JSON.stringify(section.products)}`}
            products={section.products}
            onChange={(products) =>
              updateSection(index, { ...section, products })
            }
          />
        );
    }
  }

  return (
    <form className="admin-form admin-service-form" action={saveServiceCategory}>
      <input type="hidden" name="id" value={category.id} />
      <input type="hidden" name="heroImageUrl" value={heroImageUrl} />
      <input
        type="hidden"
        name="landingSections"
        value={JSON.stringify(sections)}
      />

      <div className="admin-service-form__toolbar">
        <Link className="admin-service-form__back" href="/admin/service-categories">
          Back to Categories
        </Link>
        <button
          className="admin-button admin-button--ghost"
          type="button"
          onClick={loadDefaultContent}
          disabled={!staticLanding}
        >
          Load default content
        </button>
      </div>

      <article className="admin-card">
        <h2>Category Details</h2>
        <label>
          Name
          <input
            type="text"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
        <label>
          Description
          <textarea
            name="description"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
      </article>

      <article className="admin-card">
        <h2>Hero Image (optional)</h2>
        <p className="admin-service-form__help">
          Upload a banner image for the category landing hero. Saved to
          Cloudinary.
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
                alt="Category hero preview"
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
        <h2>Landing Header</h2>
        <label>
          Landing title
          <input
            type="text"
            name="landingTitle"
            value={landingTitle}
            onChange={(event) => setLandingTitle(event.target.value)}
            placeholder={category.name}
          />
        </label>
        <label>
          Landing tagline
          <input
            type="text"
            name="landingTagline"
            value={landingTagline}
            onChange={(event) => setLandingTagline(event.target.value)}
            placeholder="Short supporting line for the landing page"
          />
        </label>
      </article>

      <article className="admin-card">
        <div className="admin-service-form__section-header">
          <h2>Landing Sections</h2>
          <button
            className="admin-button admin-button--ghost"
            type="button"
            onClick={() =>
              setSections((current) => [...current, createEmptySection("heading")])
            }
          >
            Add section
          </button>
        </div>

        {sections.length === 0 ? (
          <p className="admin-empty">
            No landing sections yet. Add a section or load default content.
          </p>
        ) : (
          sections.map((section, index) => (
            <div className="admin-service-form__group" key={`section-${index}`}>
              <label>
                Section type
                <select
                  value={section.type}
                  onChange={(event) =>
                    changeSectionType(
                      index,
                      event.target.value as CategoryLandingSection["type"],
                    )
                  }
                >
                  {SECTION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              {renderSectionFields(section, index)}

              <div className="admin-hero-upload__actions">
                <button
                  className="admin-button admin-button--ghost"
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveSection(index, -1)}
                >
                  Move up
                </button>
                <button
                  className="admin-button admin-button--ghost"
                  type="button"
                  disabled={index === sections.length - 1}
                  onClick={() => moveSection(index, 1)}
                >
                  Move down
                </button>
                <button
                  className="admin-button admin-button--danger"
                  type="button"
                  onClick={() =>
                    setSections((current) =>
                      current.filter((_, sectionIndex) => sectionIndex !== index),
                    )
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </article>

      <div className="admin-service-form__actions">
        <button type="submit">Save Category Landing</button>
      </div>
    </form>
  );
}
