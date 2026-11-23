"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  CheckboxField,
  FormError,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/dashboard/form-fields";
import { buttonPrimary, buttonSecondary } from "@/components/dashboard/ui";
import { SPONSOR_LEVELS, type Sponsor } from "@/lib/data/types";
import type { FormState } from "@/lib/forms";

export function SponsorForm({
  action,
  sponsor,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  sponsor?: Sponsor;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} noValidate className="mt-6 max-w-2xl space-y-5">
      <FormError state={state} />
      <TextField name="name" label="Naam" required state={state} defaultValue={sponsor?.name} />
      <TextAreaField name="description" label="Beschrijving" state={state} defaultValue={sponsor?.description ?? ""} rows={4} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="logoUrl" label="Logo (URL)" type="url" state={state} defaultValue={sponsor?.logoUrl ?? ""} placeholder="https://…/logo.png" />
        <TextField name="websiteUrl" label="Website" type="url" state={state} defaultValue={sponsor?.websiteUrl ?? ""} placeholder="https://www.voorbeeld.nl" />
        <SelectField
          name="level"
          label="Sponsorniveau"
          state={state}
          defaultValue={sponsor?.level ?? ""}
          options={[
            { value: "", label: "Geen niveau" },
            ...SPONSOR_LEVELS.map((level) => ({ value: level.value, label: `${level.label} (${level.amount})` })),
          ]}
        />
        <TextField
          name="sortOrder"
          label="Volgorde"
          type="number"
          min="0"
          step="1"
          state={state}
          defaultValue={String(sponsor?.sortOrder ?? 0)}
          hint="Lager getal = eerder getoond binnen hetzelfde niveau."
        />
      </div>
      <CheckboxField
        name="isFriend"
        label="Vriend van de Soos"
        state={state}
        defaultChecked={sponsor?.isFriend ?? false}
        hint="Vrienden van de Soos worden apart op de sponsorenpagina getoond."
      />
      <div className="flex flex-wrap gap-3 pt-2">
        <button type="submit" disabled={pending} className={buttonPrimary}>
          {pending ? "Opslaan…" : "Opslaan"}
        </button>
        <Link href="/dashboard/sponsoren" className={buttonSecondary}>
          Annuleren
        </Link>
      </div>
    </form>
  );
}
