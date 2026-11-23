"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  FormError,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/dashboard/form-fields";
import { buttonPrimary, buttonSecondary } from "@/components/dashboard/ui";
import { HERO_SECTION, WEBSITE_PAGES, type WebsiteContent } from "@/lib/data/types";
import type { FormState } from "@/lib/forms";

export function ContentForm({
  action,
  item,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  item?: WebsiteContent;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} noValidate className="mt-6 max-w-2xl space-y-5">
      <FormError state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          name="page"
          label="Pagina"
          required
          state={state}
          defaultValue={item?.page ?? "home"}
          options={WEBSITE_PAGES.map((page) => ({ value: page.value, label: page.label }))}
        />
        <TextField
          name="section"
          label="Sectie"
          required
          state={state}
          defaultValue={item?.section}
          placeholder="bijv. openingstijden"
          hint={`Gebruik "${HERO_SECTION}" op Home om de welkomsttekst bovenaan te wijzigen.`}
        />
      </div>
      <TextField name="title" label="Titel" required state={state} defaultValue={item?.title} />
      <TextAreaField name="body" label="Tekst" required state={state} defaultValue={item?.body} rows={8} hint="Laat een lege regel tussen alinea's." />
      <TextField
        name="imageUrl"
        label="Afbeelding (URL)"
        type="url"
        state={state}
        defaultValue={item?.imageUrl ?? ""}
        placeholder="https://…"
      />
      <div className="flex flex-wrap gap-3 pt-2">
        <button type="submit" disabled={pending} className={buttonPrimary}>
          {pending ? "Opslaan…" : "Opslaan"}
        </button>
        <Link href="/dashboard/website" className={buttonSecondary}>
          Annuleren
        </Link>
      </div>
    </form>
  );
}
