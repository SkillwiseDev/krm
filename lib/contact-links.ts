type ContactFormLinkOptions = {
  requirement?: string;
  sourcePage: string;
  sourcePath: string;
  formName?: string;
};

export function contactFormLink({
  requirement,
  sourcePage,
  sourcePath,
  formName,
}: ContactFormLinkOptions): string {
  const params = new URLSearchParams();

  if (requirement) {
    params.set("requirement", requirement);
  }

  params.set("source", sourcePage);
  params.set("from", sourcePath);

  if (formName) {
    params.set("form", formName);
  }

  const query = params.toString();
  return query ? `/contact?${query}#contact-form` : "/contact#contact-form";
}
