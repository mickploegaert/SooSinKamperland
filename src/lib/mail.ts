import { contactInfo } from "@/lib/contact-info";

export type OutgoingMail = {
  subject: string;
  /** Naam en e-mailadres van de bezoeker, zodat de soos kan antwoorden. */
  replyTo: { name: string; email: string };
  /** Velden die in het bericht komen, in volgorde. */
  fields: Record<string, string>;
};

/**
 * Verstuurt een bericht naar het e-mailadres van de soos.
 *
 * TODO: koppel hier een mailprovider (bijvoorbeeld Resend of SMTP) en lees de
 * sleutel uit een omgevingsvariabele. Zolang er geen provider is gekoppeld,
 * wordt het bericht lokaal alleen in de serverlog getoond en geeft de functie
 * in productie `false` terug, zodat bezoekers nooit ten onrechte "verstuurd" zien.
 */
export async function sendMail(mail: OutgoingMail): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") {
    console.info(`[mail] Voor ${contactInfo.email}:`, mail);
    return true;
  }

  return false;
}
