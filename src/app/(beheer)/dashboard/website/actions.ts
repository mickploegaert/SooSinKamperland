"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import { getDatabase } from "@/lib/data";
import { WEBSITE_PAGES, type WebsitePage } from "@/lib/data/types";
import { type FormState, formValues, isValidUrlOrPath, text } from "@/lib/forms";

const LIST_PATH = "/dashboard/website";

function revalidatePublicPage(page: WebsitePage) {
  const target = WEBSITE_PAGES.find((item) => item.value === page);
  if (target) revalidatePath(target.path);
}

export async function saveWebsiteContent(
  id: number | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const admin = await requireAdmin();
  const values = formValues(formData);

  const page = text(formData, "page") as WebsitePage;
  const section = text(formData, "section").toLowerCase();
  const title = text(formData, "title");
  const body = text(formData, "body");
  const imageUrl = text(formData, "imageUrl");

  const errors: Record<string, string> = {};
  if (!WEBSITE_PAGES.some((item) => item.value === page)) errors.page = "Kies een pagina.";
  if (!section) errors.section = "Vul een sectienaam in.";
  else if (!/^[a-z0-9-]{1,100}$/.test(section))
    errors.section = "Gebruik alleen kleine letters, cijfers en streepjes (max. 100 tekens).";
  if (!title) errors.title = "Vul een titel in.";
  else if (title.length > 255) errors.title = "De titel mag maximaal 255 tekens lang zijn.";
  if (!body) errors.body = "Vul de tekst in.";
  if (imageUrl && (!isValidUrlOrPath(imageUrl) || imageUrl.length > 255))
    errors.imageUrl = "Vul een geldige afbeeldings-URL in (https://… of /pad).";

  const db = getDatabase();
  if (!errors.page && !errors.section) {
    const existing = await db.websiteContent.findBySection(page, section);
    if (existing && existing.id !== id)
      errors.section = "Deze sectie bestaat al op deze pagina. Kies een andere naam.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values, message: "Controleer de gemarkeerde velden." };
  }

  const input = { page, section, title, body, imageUrl: imageUrl || null, updatedBy: admin.id };

  try {
    if (id === null) {
      await db.websiteContent.create(input);
    } else {
      const previous = await db.websiteContent.findById(id);
      const updated = await db.websiteContent.update(id, input);
      if (!updated) return { values, message: "Dit item bestaat niet meer." };
      if (previous && previous.page !== page) revalidatePublicPage(previous.page);
    }
  } catch (error) {
    console.error("Opslaan van website-inhoud mislukt", error);
    return { values, message: "Opslaan is mislukt. Probeer het opnieuw." };
  }

  revalidatePublicPage(page);
  redirect(`${LIST_PATH}?melding=${id === null ? "toegevoegd" : "opgeslagen"}`);
}

export async function deleteWebsiteContent(id: number): Promise<void> {
  await requireAdmin();
  const db = getDatabase();
  const item = await db.websiteContent.findById(id);
  if (item) {
    await db.websiteContent.delete(id);
    revalidatePublicPage(item.page);
  }
  redirect(`${LIST_PATH}?melding=verwijderd`);
}
