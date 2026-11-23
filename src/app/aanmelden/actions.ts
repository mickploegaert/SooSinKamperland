"use server";

import { activitySlug, upcomingActivities } from "@/lib/activities";
import { sendMail } from "@/lib/mail";
import type { RegistrationState } from "@/lib/registration-schema";
import { verifyTurnstile } from "@/lib/turnstile";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function sendRegistration(
  _previous: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  if (text(formData, "website")) {
    return { status: "success", message: "Bedankt voor je aanmelding!" };
  }

  const values = {
    activity: text(formData, "activity"),
    name: text(formData, "name"),
    email: text(formData, "email"),
    people: text(formData, "people") || "1",
    note: text(formData, "note"),
  };

  const activity = upcomingActivities().find((item) => activitySlug(item) === values.activity);
  const people = Number(values.people);

  const errors: RegistrationState["errors"] = {};
  if (!activity) errors.activity = "Kies een activiteit die nog gaat plaatsvinden.";
  if (values.name.length < 2) errors.name = "Vul je naam in.";
  if (!EMAIL_PATTERN.test(values.email)) errors.email = "Vul een geldig e-mailadres in.";
  if (!Number.isInteger(people) || people < 1 || people > 10) {
    errors.people = "Kies een aantal tussen 1 en 10.";
  }
  if (values.note.length > 500) errors.note = "Je opmerking is te lang (maximaal 500 tekens).";

  if (Object.keys(errors).length > 0 || !activity) {
    return { status: "error", errors, values, message: "Controleer de gemarkeerde velden." };
  }

  const token = formData.get("cf-turnstile-response");
  if (!(await verifyTurnstile(typeof token === "string" ? token : null))) {
    return {
      status: "error",
      values,
      message: "We konden niet controleren of je geen robot bent. Probeer het opnieuw.",
    };
  }

  const sent = await sendMail({
    subject: `Aanmelding: ${activity.name} (${activity.date})`,
    replyTo: { name: values.name, email: values.email },
    fields: {
      Activiteit: `${activity.name} (${activity.date})`,
      Naam: values.name,
      "E-mailadres": values.email,
      "Aantal personen": String(people),
      Opmerking: values.note || "-",
    },
  });
  if (!sent) {
    return {
      status: "error",
      values,
      message: "Je aanmelding kon niet worden verstuurd. Probeer het later opnieuw of mail ons direct.",
    };
  }

  return {
    status: "success",
    message: `Bedankt! Je aanmelding voor ${activity.name} is binnen. We nemen contact met je op als dat nodig is.`,
  };
}
