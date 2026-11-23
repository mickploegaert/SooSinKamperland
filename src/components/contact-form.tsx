"use client";

import { useActionState } from "react";
import { sendContact } from "@/app/contact/actions";
import { SubmitButton } from "@/components/button";
import { ErrorBanner, Field, Honeypot, SuccessMessage, inputClass } from "@/components/form-fields";
import { contactSubjects, type ContactField, type ContactState } from "@/lib/contact-schema";

const initialState: ContactState = { status: "idle" };

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initialState);

  if (state.status === "success") {
    return <SuccessMessage title="Bericht verstuurd" message={state.message} />;
  }

  const errors = state.errors ?? {};
  const values = state.values;
  const describe = (field: ContactField) => (errors[field] ? `${field}-fout` : undefined);

  return (
    <form action={action} noValidate className="space-y-5">
      <ErrorBanner message={state.status === "error" ? state.message : undefined} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Naam" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            defaultValue={values?.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describe("name")}
            placeholder="Je naam"
            className={inputClass}
          />
        </Field>
        <Field id="email" label="E-mailadres" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={values?.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describe("email")}
            placeholder="naam@voorbeeld.nl"
            className={inputClass}
          />
        </Field>
      </div>

      <Field id="subject" label="Waar gaat je bericht over?" error={errors.subject}>
        <select
          id="subject"
          name="subject"
          required
          defaultValue={values?.subject ?? ""}
          aria-invalid={errors.subject ? true : undefined}
          aria-describedby={describe("subject")}
          className={inputClass}
        >
          <option value="" disabled>
            Kies een onderwerp
          </option>
          {contactSubjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </Field>

      <Field id="message" label="Bericht" error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          maxLength={2000}
          defaultValue={values?.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describe("message")}
          placeholder="Waar kunnen we je mee helpen?"
          className={inputClass}
        />
      </Field>

      <Honeypot />

      {/* Cloudflare Turnstile komt hier (div met class="cf-turnstile" en de sitekey). */}

      <p className="text-sm text-soos-ink/75">
        Je gegevens gebruiken we alleen om te antwoorden. Lees onze{" "}
        <a href="/privacy" className="font-semibold text-soos-purple underline underline-offset-2">
          privacyverklaring
        </a>
        .
      </p>

      <SubmitButton pending={pending} pendingLabel="Versturen…">
        Verstuur bericht
      </SubmitButton>
    </form>
  );
}
