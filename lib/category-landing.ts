export type CategoryCta = {
  label: string;
  requirement: string;
  formName?: string;
};

export type CategoryProductHighlight = {
  title: string;
  badge?: string;
  idealFor?: string;
  points: string[];
  href?: string;
  cta?: CategoryCta;
};

export type CategoryLandingSection =
  | { type: "intro"; paragraphs: string[] }
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraphs"; paragraphs: string[] }
  | { type: "bullets"; items: string[] }
  | {
      type: "advantages";
      title: string;
      items: { title: string; body: string }[];
    }
  | { type: "productGrid"; products: CategoryProductHighlight[] }
  | {
      type: "table";
      title?: string;
      headers: string[];
      rows: string[][];
    }
  | { type: "cta"; cta: CategoryCta }
  | { type: "closing"; title: string; paragraphs: string[]; cta?: CategoryCta };

export type CategoryLanding = {
  slug: string;
  title: string;
  tagline: string;
  sections: CategoryLandingSection[];
};
