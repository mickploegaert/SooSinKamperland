"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import { getDatabase } from "@/lib/data";
import type { AppointmentInput } from "@/lib/data/types";
import { type FormState, formValues, isValidDate, isValidTime, text } from "@/lib/forms";

const LIST_PATH = "/dashboard/agenda";

export async function saveAppointment(
  id: number | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const admin = await requireAdmin();
  const values = formValues(formData);

  const title = text(formData, "title");
  const date = text(formData, "date");
  const startTime = text(formData, "startTime");
  const endTime = text(formData, "endTime");
  const location = text(formData, "location");
  const notes = text(formData, "notes");

  const errors: Record<string, string> = {};
  if (!title) errors.title = "Vul een titel in.";
  else if (title.length > 255) errors.title = "De titel mag maximaal 255 tekens lang zijn.";
  if (!date) errors.date = "Vul de datum in.";
  else if (!isValidDate(date)) errors.date = "Vul een geldige datum in.";
  if (!startTime) errors.startTime = "Vul de begintijd in.";
  else if (!isValidTime(startTime)) errors.startTime = "Vul een geldige tijd in (UU:MM).";
  if (endTime && !isValidTime(endTime)) errors.endTime = "Vul een geldige tijd in (UU:MM).";
  else if (endTime && !errors.startTime && endTime <= startTime)
    errors.endTime = "De eindtijd moet na de begintijd liggen.";
  if (location.length > 255) errors.location = "De locatie mag maximaal 255 tekens lang zijn.";

  if (Object.keys(errors).length > 0) {
    return { errors, values, message: "Controleer de gemarkeerde velden." };
  }

  const input: AppointmentInput = {
    title,
    date,
    startTime,
    endTime: endTime || null,
    location: location || null,
    notes: notes || null,
    updatedBy: admin.id,
  };

  try {
    const db = getDatabase();
    if (id === null) {
      await db.appointments.create(input);
    } else {
      const updated = await db.appointments.update(id, input);
      if (!updated) return { values, message: "Deze afspraak bestaat niet meer." };
    }
  } catch (error) {
    console.error("Opslaan van afspraak mislukt", error);
    return { values, message: "Opslaan is mislukt. Probeer het opnieuw." };
  }

  redirect(`${LIST_PATH}?melding=${id === null ? "toegevoegd" : "opgeslagen"}`);
}

export async function deleteAppointment(id: number): Promise<void> {
  await requireAdmin();
  await getDatabase().appointments.delete(id);
  redirect(`${LIST_PATH}?melding=verwijderd`);
}
