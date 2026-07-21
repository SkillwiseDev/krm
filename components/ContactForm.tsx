"use client";

import { useActionState } from "react";
import { submitSiteForm, type SiteFormState } from "@/lib/site-form-actions";

const initialState: SiteFormState = {};

type ContactFormProps = {
  formName?: string;
  sourcePage?: string;
  sourcePath?: string;
  requirementType?: string;
};

export default function ContactForm({
  formName = "Contact Enquiry",
  sourcePage = "Contact",
  sourcePath = "/contact",
  requirementType,
}: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitSiteForm,
    initialState,
  );

  return (
    <form className="contact-enquiry-form" action={formAction}>
      <input type="hidden" name="formName" value={formName} />
      <input type="hidden" name="sourcePage" value={sourcePage} />
      <input type="hidden" name="sourcePath" value={sourcePath} />
      {requirementType ? (
        <input type="hidden" name="requirementType" value={requirementType} />
      ) : null}

      {requirementType ? (
        <p className="contact-form__context">
          Enquiry type: <strong>{requirementType}</strong>
        </p>
      ) : null}

      <label>
        <span className="sr-only">First name</span>
        <input type="text" name="firstName" placeholder="First name" required />
      </label>
      <label>
        <span className="sr-only">Organization or Laboratory Name</span>
        <input
          type="text"
          name="organization"
          placeholder="Organization / Laboratory Name"
        />
      </label>
      <label>
        <span className="sr-only">Phone Number</span>
        <input type="tel" name="phone" placeholder="Phone Number" required />
      </label>
      <label>
        <span className="sr-only">Email Address</span>
        <input type="email" name="email" placeholder="Email Address" required />
      </label>
      <label>
        <span className="sr-only">Message</span>
        <textarea
          name="message"
          rows={4}
          placeholder="Your message (optional)"
        />
      </label>
      {state.error ? (
        <p
          className="contact-form__message contact-form__message--error"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p
          className="contact-form__message contact-form__message--success"
          role="status"
        >
          Your enquiry has been submitted successfully.
        </p>
      ) : null}
      <button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Enquiry"}
      </button>
    </form>
  );
}
