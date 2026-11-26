"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormError, TextAreaField, TextField } from "@/components/dashboard/form-fields";
import { buttonPrimary, buttonSecondary } from "@/components/dashboard/ui";
import type { Appointment } from "@/lib/data/types";
import type { FormState } from "@/lib/forms";

export function AppointmentForm({
  action,
  appointment,
  defaultDate,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  appointment?: Appointment;
  defaultDate?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} noValidate className="mt-6 max-w-2xl space-y-5">
      <FormError state={state} />
      <TextField name="title" label="Titel" required state={state} defaultValue={appointment?.title} placeholder="bijv. Bestuursvergadering" />
      <div className="grid gap-5 sm:grid-cols-3">
        <TextField name="date" label="Datum" type="date" required state={state} defaultValue={appointment?.date ?? defaultDate} />
        <TextField name="startTime" label="Begintijd" type="time" required state={state} defaultValue={appointment?.startTime} />
        <TextField name="endTime" label="Eindtijd" type="time" state={state} defaultValue={appointment?.endTime ?? ""} />
      </div>
      <TextField name="location" label="Locatie" state={state} defaultValue={appointment?.location ?? ""} placeholder="Soos in Kamperland" />
      <TextAreaField name="notes" label="Notities" state={state} defaultValue={appointment?.notes ?? ""} rows={4} />
      <div className="flex flex-wrap gap-3 pt-2">
        <button type="submit" disabled={pending} className={buttonPrimary}>
          {pending ? "Opslaan…" : "Opslaan"}
        </button>
        <Link href="/dashboard/agenda" className={buttonSecondary}>
          Annuleren
        </Link>
      </div>
    </form>
  );
}
