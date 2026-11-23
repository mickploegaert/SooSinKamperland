"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  CheckboxField,
  FormError,
  TextAreaField,
  TextField,
} from "@/components/dashboard/form-fields";
import { buttonPrimary, buttonSecondary } from "@/components/dashboard/ui";
import type { Activity } from "@/lib/data/types";
import type { FormState } from "@/lib/forms";

export function ActivityForm({
  action,
  activity,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  activity?: Activity;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} noValidate className="mt-6 max-w-2xl space-y-5">
      <FormError state={state} />
      <TextField name="name" label="Naam" required state={state} defaultValue={activity?.name} placeholder="bijv. Bingo Avond" />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="startDate" label="Datum" type="date" required state={state} defaultValue={activity?.startDate} />
        <TextField name="endDate" label="Einddatum" type="date" state={state} defaultValue={activity?.endDate ?? ""} hint="Alleen voor activiteiten van meerdere dagen." />
        <TextField name="startTime" label="Begintijd" type="time" state={state} defaultValue={activity?.startTime ?? ""} />
        <TextField name="endTime" label="Eindtijd" type="time" state={state} defaultValue={activity?.endTime ?? ""} />
      </div>
      <TextAreaField name="description" label="Beschrijving" required state={state} defaultValue={activity?.description} rows={6} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="category" label="Categorie" state={state} defaultValue={activity?.category ?? ""} placeholder="bijv. Feest" />
        <TextField name="location" label="Locatie" state={state} defaultValue={activity?.location ?? ""} placeholder="Soos in Kamperland" />
      </div>
      <TextField name="imageUrl" label="Afbeelding (URL)" type="url" state={state} defaultValue={activity?.imageUrl ?? ""} placeholder="https://…" />
      <CheckboxField
        name="isVisible"
        label="Tonen op de website"
        state={state}
        defaultChecked={activity?.isVisible ?? true}
      />
      <div className="flex flex-wrap gap-3 pt-2">
        <button type="submit" disabled={pending} className={buttonPrimary}>
          {pending ? "Opslaan…" : "Opslaan"}
        </button>
        <Link href="/dashboard/activiteiten" className={buttonSecondary}>
          Annuleren
        </Link>
      </div>
    </form>
  );
}
