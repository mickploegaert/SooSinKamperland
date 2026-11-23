"use client";

import { useActionState } from "react";
import { sendContact } from "@/app/contact/actions";
import { contactSubjects, type ContactField, type ContactState } from "@/lib/contact-schema";

const initialState: ContactState = { status: "idle" };

const inputClass =
  "mt-2 block w-full rounded-xl border border-soos-dark/15 bg-white px-4 py-3 text-base text-soos-ink shadow-sm transition placeholder:text-soos-ink/40 focus:border-soos-purple focus:outline-none focus:ring-4 focus:ring-soos-purple/15 aria-[invalid=true]:border-red-600 aria-[invalid=true]:ring-red-600/10";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: ContactField;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-soos-dark">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-fout`} className="mt-2 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initialState);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="flex h-full flex-col items-center justify-center rounded-2xl bg-soos-mist px-6 py-14 text-center"
      >
        <span
          aria-hidden
          className="flex size-16 items-center justify-center rounded-full bg-soos-purple text-3xl text-white"
        >
          ✓
        </span>
        <h2 className="mt-5 text-2xl font-bold text-soos-dark">Bericht verstuurd</h2>
        <p className="mt-2 max-w-sm text-base text-soos-ink/85">{state.message}</p>
      </div>
    );
  }

  const errors = state.errors ?? {};
  const values = state.values;
  const describe = (field: ContactField) => (errors[field] ? `${field}-fout` : undefined);

  return (
    <form action={action} noValidate className="space-y-5">
      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          {state.message}
        </p>
      ) : null}

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

      {/* Lokvalk voor bots: mensen zien en vullen dit veld niet in. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Laat dit veld leeg</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Cloudflare Turnstile komt hier (div met class="cf-turnstile" en de sitekey). */}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-soos-purple px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-soos-purple/25 transition hover:bg-[#3f1080] focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {pending ? "Versturen…" : "Verstuur bericht"}
        <span aria-hidden>→</span>
      </button>
    </form>
  );
}
