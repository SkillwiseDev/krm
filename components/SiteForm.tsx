"use client";

import { useActionState, type ReactNode } from "react";
import { submitSiteForm, type SiteFormState } from "@/lib/site-form-actions";

const initialState: SiteFormState = {};

type SiteFormProps = {
  formName: string;
  sourcePage: string;
  sourcePath: string;
  requirementType?: string;
  submitLabel?: string;
  className?: string;
  children?: ReactNode;
};

export default function SiteForm({
  formName,
  sourcePage,
  sourcePath,
  requirementType,
  submitLabel = "Submit",
  className = "site-form",
  children,
}: SiteFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitSiteForm,
    initialState,
  );

  return (
    <form className={className} action={formAction}>
      <input type="hidden" name="formName" value={formName} />
      <input type="hidden" name="sourcePage" value={sourcePage} />
      <input type="hidden" name="sourcePath" value={sourcePath} />
      {requirementType ? (
        <input type="hidden" name="requirementType" value={requirementType} />
      ) : null}

      {children}

      {state.error ? (
        <p className="contact-form__message contact-form__message--error" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p
          className="contact-form__message contact-form__message--success"
          role="status"
        >
          {formName === "Booking"
            ? "Your booking request has been submitted successfully. We will contact you soon."
            : "Submitted successfully."}
        </p>
      ) : null}
      <button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : submitLabel}
      </button>
    </form>
  );
}
