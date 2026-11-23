"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import { getDatabase } from "@/lib/data";
import { SPONSOR_LEVELS, type SponsorInput, type SponsorLevel } from "@/lib/data/types";
import { type FormState, formValues, isValidUrlOrPath, text } from "@/lib/forms";

const LIST_PATH = "/dashboard/sponsoren";

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function saveSponsor(
  id: number | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const admin = await requireAdmin();
  const values = formValues(formData);

  const name = text(formData, "name");
  const description = text(formData, "description");
  const logoUrl = text(formData, "logoUrl");
  let websiteUrl = text(formData, "websiteUrl");
  const level = text(formData, "level");
  const sortOrderRaw = text(formData, "sortOrder");

  // "www.voorbeeld.nl" wordt automatisch "https://www.voorbeeld.nl".
  if (websiteUrl && !/^[a-z]+:\/\//i.test(websiteUrl)) websiteUrl = `https://${websiteUrl}`;

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Vul de naam van de sponsor in.";
  else if (name.length > 255) errors.name = "De naam mag maximaal 255 tekens lang zijn.";
  if (logoUrl && (!isValidUrlOrPath(logoUrl) || logoUrl.length > 255))
    errors.logoUrl = "Vul een geldige logo-URL in (https://… of /pad).";
  if (websiteUrl && (!isHttpUrl(websiteUrl) || websiteUrl.length > 255))
    errors.websiteUrl = "Vul een geldig websiteadres in.";
  if (level && !SPONSOR_LEVELS.some((item) => item.value === level))
    errors.level = "Kies een geldig niveau.";
  const sortOrder = sortOrderRaw ? Number(sortOrderRaw) : 0;
  if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 9999)
    errors.sortOrder = "Vul een heel getal van 0 t/m 9999 in.";

  if (Object.keys(errors).length > 0) {
    return { errors, values, message: "Controleer de gemarkeerde velden." };
  }

  const input: SponsorInput = {
    name,
    description: description || null,
    logoUrl: logoUrl || null,
    websiteUrl: websiteUrl || null,
    level: (level || null) as SponsorLevel | null,
    isFriend: formData.get("isFriend") === "on",
    sortOrder,
    updatedBy: admin.id,
  };

  try {
    const db = getDatabase();
    if (id === null) {
      await db.sponsors.create(input);
    } else if (!(await db.sponsors.update(id, input))) {
      return { values, message: "Deze sponsor bestaat niet meer." };
    }
  } catch (error) {
    console.error("Opslaan van sponsor mislukt", error);
    return { values, message: "Opslaan is mislukt. Probeer het opnieuw." };
  }

  revalidatePath("/sponsoren");
  redirect(`${LIST_PATH}?melding=${id === null ? "toegevoegd" : "opgeslagen"}`);
}

export async function deleteSponsor(id: number): Promise<void> {
  await requireAdmin();
  await getDatabase().sponsors.delete(id);
  revalidatePath("/sponsoren");
  redirect(`${LIST_PATH}?melding=verwijderd`);
}
