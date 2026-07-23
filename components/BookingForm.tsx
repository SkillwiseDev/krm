"use client";

import SiteForm from "@/components/SiteForm";

export default function BookingForm() {
  return (
    <SiteForm
      className="contact-enquiry-form booking-form"
      formName="Booking"
      sourcePage="Book Now"
      sourcePath="/book"
      requirementType="Book Now"
      submitLabel="Book Now"
    >
      <p className="contact-form__context">
        Book a consultation with KRM Healthcare. Our team will confirm your
        preferred slot.
      </p>

      <label>
        <span className="sr-only">Full name</span>
        <input type="text" name="firstName" placeholder="Full name" required />
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
        <span className="booking-form__label">Service interest</span>
        <select name="Service Interest" required defaultValue="">
          <option value="" disabled>
            Select a service
          </option>
          <option value="Laboratory Equipment">Laboratory Equipment</option>
          <option value="Reagents">Reagents</option>
          <option value="Turnkey Lab Solutions">Turnkey Lab Solutions</option>
          <option value="Franchise Enquiry">Franchise Enquiry</option>
          <option value="Factory Visit">Factory Visit</option>
          <option value="Consultation">Consultation</option>
        </select>
      </label>

      <label>
        <span className="booking-form__label">Preferred date</span>
        <input type="date" name="Preferred Date" required />
      </label>

      <label>
        <span className="booking-form__label">Preferred time</span>
        <select name="Preferred Time" required defaultValue="">
          <option value="" disabled>
            Select a time
          </option>
          <option value="Morning (9 AM – 12 PM)">Morning (9 AM – 12 PM)</option>
          <option value="Afternoon (12 PM – 3 PM)">
            Afternoon (12 PM – 3 PM)
          </option>
          <option value="Evening (3 PM – 6 PM)">Evening (3 PM – 6 PM)</option>
        </select>
      </label>

      <label>
        <span className="sr-only">City / Location</span>
        <input type="text" name="City / Location" placeholder="City / Location" />
      </label>

      <label>
        <span className="sr-only">Additional details</span>
        <textarea
          name="message"
          rows={4}
          placeholder="Additional details (optional)"
        />
      </label>
    </SiteForm>
  );
}
