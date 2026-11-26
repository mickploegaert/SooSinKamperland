"use client";

import { useActionState } from "react";
import { sendRegistration } from "@/app/(site)/aanmelden/actions";
import { SubmitButton } from "@/components/button";
import { ErrorBanner, Field, Honeypot, SuccessMessage, inputClass } from "@/components/form-fields";
import type { RegistrationField, RegistrationState } from "@/lib/registration-schema";

const initialState: RegistrationState = { status: "idle" };

export type ActivityOption = { slug: string; label: string };

export function RegistrationForm({
  options,
  selected,
}: {
  options: ActivityOption[];
  selected?: string;
}) {
  const [state, action, pending] = useActionState(sendRegistration, initialState);

  if (state.status === "success") {
    return <SuccessMessage title="Aanmelding ontvangen" message={state.message} />;
  }

  const errors = state.errors ?? {};
  const values = state.values;
  const describe = (field: RegistrationField) => (errors[field] ? `${field}-fout` : undefined);

  return (
    <form action={action} noValidate className="space-y-5">
      <ErrorBanner message={state.status === "error" ? state.message : undefined} />

      <Field id="activity" label="Activiteit" error={errors.activity}>
        <select
          id="activity"
          name="activity"
          required
          defaultValue={values?.activity ?? selected ?? ""}
          aria-invalid={errors.activity ? true : undefined}
          aria-describedby={describe("activity")}
          className={inputClass}
        >
          <option value="" disabled>
            Kies een activiteit
          </option>
          {options.map((option) => (
            <option key={option.slug} value={option.slug}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

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

      <Field id="people" label="Aantal personen" error={errors.people}>
        <input
          id="people"
          name="people"
          type="number"
          min={1}
          max={10}
          inputMode="numeric"
          required
          defaultValue={values?.people ?? "1"}
          aria-invalid={errors.people ? true : undefined}
          aria-describedby={describe("people")}
          className={inputClass}
        />
      </Field>

      <Field id="note" label="Opmerking" hint="(niet verplicht)" error={errors.note}>
        <textarea
          id="note"
          name="note"
          rows={4}
          maxLength={500}
          defaultValue={values?.note}
          aria-invalid={errors.note ? true : undefined}
          aria-describedby={describe("note")}
          placeholder="Bijvoorbeeld een allergie of een vraag"
          className={inputClass}
        />
      </Field>

      <Honeypot />

      {/* Cloudflare Turnstile komt hier (div met class="cf-turnstile" en de sitekey). */}

      <p className="text-sm text-soos-ink/75">
        Je gegevens gebruiken we alleen voor deze aanmelding. Lees onze{" "}
        <a href="/privacy" className="font-semibold text-soos-purple underline underline-offset-2">
          privacyverklaring
        </a>
        .
      </p>

      <SubmitButton pending={pending} pendingLabel="Versturen…">
        Meld me aan
      </SubmitButton>
    </form>
  );
}
