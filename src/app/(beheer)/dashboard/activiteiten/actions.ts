"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import { getDatabase } from "@/lib/data";
import type { ActivityInput } from "@/lib/data/types";
import {
  type FormState,
  formValues,
  isValidDate,
  isValidTime,
  isValidUrlOrPath,
  text,
} from "@/lib/forms";

const LIST_PATH = "/dashboard/activiteiten";

function revalidatePublic(id?: number) {
  revalidatePath("/activiteiten");
  if (id) revalidatePath(`/activiteiten/${id}`);
}

export async function saveActivity(
  id: number | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const admin = await requireAdmin();
  const values = formValues(formData);

  const name = text(formData, "name");
  const description = text(formData, "description");
  const category = text(formData, "category");
  const startDate = text(formData, "startDate");
  const endDate = text(formData, "endDate");
  const startTime = text(formData, "startTime");
  const endTime = text(formData, "endTime");
  const location = text(formData, "location");
  const repeatEvery = text(formData, "repeatEvery");
  const repeatUntil = text(formData, "repeatUntil");
  const imageUrl = text(formData, "imageUrl");

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Vul de naam van de activiteit in.";
  else if (name.length > 255) errors.name = "De naam mag maximaal 255 tekens lang zijn.";
  if (!startDate) errors.startDate = "Vul de datum in.";
  else if (!isValidDate(startDate)) errors.startDate = "Vul een geldige datum in.";
  if (!description) errors.description = "Vul een beschrijving in.";
  if (endDate && !isValidDate(endDate)) errors.endDate = "Vul een geldige einddatum in.";
  else if (endDate && !errors.startDate && endDate < startDate)
    errors.endDate = "De einddatum mag niet voor de startdatum liggen.";
  if (startTime && !isValidTime(startTime)) errors.startTime = "Vul een geldige tijd in (UU:MM).";
  if (endTime && !isValidTime(endTime)) errors.endTime = "Vul een geldige tijd in (UU:MM).";
  else if (endTime && !startTime) errors.startTime = "Vul ook een begintijd in.";
  if (repeatEvery && repeatEvery !== "week" && repeatEvery !== "month")
    errors.repeatEvery = "Kies elke week, elke maand of niet herhalen.";
  if (repeatEvery && !repeatUntil) errors.repeatUntil = "Vul in tot wanneer de activiteit herhaald wordt.";
  else if (repeatUntil && !isValidDate(repeatUntil)) errors.repeatUntil = "Vul een geldige datum in.";
  else if (repeatUntil && startDate && repeatUntil < startDate)
    errors.repeatUntil = "De herhaling moet na de startdatum eindigen.";
  if (category.length > 50) errors.category = "De categorie mag maximaal 50 tekens lang zijn.";
  if (location.length > 255) errors.location = "De locatie mag maximaal 255 tekens lang zijn.";
  if (imageUrl && (!isValidUrlOrPath(imageUrl) || imageUrl.length > 255))
    errors.imageUrl = "Vul een geldige afbeeldings-URL in (https://… of /pad).";

  if (Object.keys(errors).length > 0) {
    return { errors, values, message: "Controleer de gemarkeerde velden." };
  }

  const input: ActivityInput = {
    name,
    description,
    category: category || null,
    startDate,
    endDate: endDate || null,
    startTime: startTime || null,
    endTime: endTime || null,
    location: location || null,
    repeatEvery: repeatEvery === "week" || repeatEvery === "month" ? repeatEvery : null,
    repeatUntil: repeatEvery ? repeatUntil : null,
    imageUrl: imageUrl || null,
    isVisible: formData.get("isVisible") === "on",
    updatedBy: admin.id,
  };

  try {
    const db = getDatabase();
    if (id === null) {
      const created = await db.activities.create(input);
      revalidatePublic(created.id);
    } else {
      const updated = await db.activities.update(id, input);
      if (!updated) return { values, message: "Deze activiteit bestaat niet meer." };
      revalidatePublic(id);
    }
  } catch (error) {
    console.error("Opslaan van activiteit mislukt", error);
    return { values, message: "Opslaan is mislukt. Probeer het opnieuw." };
  }

  redirect(`${LIST_PATH}?melding=${id === null ? "toegevoegd" : "opgeslagen"}`);
}

export async function deleteActivity(id: number): Promise<void> {
  await requireAdmin();
  await getDatabase().activities.delete(id);
  revalidatePublic(id);
  redirect(`${LIST_PATH}?melding=verwijderd`);
}
