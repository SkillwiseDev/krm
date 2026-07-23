import type { ServiceCategory, ServiceCategoryLanding } from "@/lib/admin-store";
import type {
  CategoryLanding,
  CategoryLandingSection,
} from "@/lib/category-landing";
import { biochemistryLanding } from "@/lib/category-landings/biochemistry";
import { hematologyLanding } from "@/lib/category-landings/hematology";
import { rapidTestKitsLanding } from "@/lib/category-landings/rapid-test-kits";
import { reagentsLanding } from "@/lib/category-landings/reagents";

const STATIC_LANDINGS: Record<string, CategoryLanding> = {
  hematology: hematologyLanding,
  "rapid-test-kits": rapidTestKitsLanding,
  biochemistry: biochemistryLanding,
  reagents: reagentsLanding,
};

export function getStaticCategoryLanding(
  slug: string,
): CategoryLanding | null {
  return STATIC_LANDINGS[slug] ?? null;
}

export function getAllStaticCategoryLandings(): CategoryLanding[] {
  return Object.values(STATIC_LANDINGS);
}

export function categoryLandingFromDb(
  category: ServiceCategory,
): CategoryLanding | null {
  if (!category.landing?.sections?.length && !category.landing?.title) {
    return null;
  }

  return {
    slug: category.slug,
    title: category.landing?.title || category.name,
    tagline: category.landing?.tagline || category.description || "",
    sections: category.landing?.sections ?? [],
  };
}

/** Prefer DB landing; fall back to static seed content. */
export function resolveCategoryLanding(
  category: ServiceCategory | null,
  slug: string,
): CategoryLanding | null {
  if (category) {
    const fromDb = categoryLandingFromDb(category);
    if (fromDb) {
      return fromDb;
    }
  }

  return getStaticCategoryLanding(slug);
}

export function toServiceCategoryLanding(
  landing: CategoryLanding,
): ServiceCategoryLanding {
  return {
    title: landing.title,
    tagline: landing.tagline,
    sections: landing.sections,
  };
}

export function parseLandingSections(
  value: FormDataEntryValue | null,
): CategoryLandingSection[] {
  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as CategoryLandingSection[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
