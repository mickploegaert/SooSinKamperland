"use server";

import { contactSubjects, type ContactState } from "@/lib/contact-schema";
import { sendContactMail } from "@/lib/mail";
import { verifyTurnstile } from "@/lib/turnstile";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function sendContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Verborgen veld dat alleen bots invullen: doe alsof het gelukt is.
  if (text(formData, "website")) {
    return { status: "success", message: "Bedankt voor je bericht!" };
  }

  const values = {
    name: text(formData, "name"),
    email: text(formData, "email"),
    subject: text(formData, "subject"),
    message: text(formData, "message"),
  };

  const errors: ContactState["errors"] = {};
  if (values.name.length < 2) errors.name = "Vul je naam in.";
  if (!EMAIL_PATTERN.test(values.email)) errors.email = "Vul een geldig e-mailadres in.";
  if (!(contactSubjects as readonly string[]).includes(values.subject)) {
    errors.subject = "Kies een onderwerp.";
  }
  if (values.message.length < 10) {
    errors.message = "Schrijf een bericht van minimaal 10 tekens.";
  } else if (values.message.length > 2000) {
    errors.message = "Je bericht is te lang (maximaal 2000 tekens).";
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, values, message: "Controleer de gemarkeerde velden." };
  }

  const token = formData.get("cf-turnstile-response");
  const human = await verifyTurnstile(typeof token === "string" ? token : null);
  if (!human) {
    return {
      status: "error",
      values,
      message: "We konden niet controleren of je geen robot bent. Probeer het opnieuw.",
    };
  }

  const sent = await sendContactMail(values);
  if (!sent) {
    return {
      status: "error",
      values,
      message:
        "Je bericht kon niet worden verstuurd. Probeer het later opnieuw of mail ons direct.",
    };
  }

  return {
    status: "success",
    message: "Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.",
  };
}
