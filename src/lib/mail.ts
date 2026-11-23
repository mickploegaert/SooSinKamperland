import { contactInfo } from "@/lib/contact-info";

export type ContactMessage = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

/**
 * Verstuurt een bericht van het contactformulier naar het e-mailadres van de soos.
 *
 * TODO: koppel hier een mailprovider (bijvoorbeeld Resend of SMTP) en lees de
 * sleutel uit een omgevingsvariabele. Zolang er geen provider is gekoppeld,
 * wordt het bericht lokaal alleen in de serverlog getoond en geeft de functie
 * in productie `false` terug, zodat bezoekers nooit ten onrechte "verstuurd" zien.
 */
export async function sendContactMail(message: ContactMessage): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") {
    console.info(`[contact] Bericht voor ${contactInfo.email}:`, message);
    return true;
  }

  return false;
}
