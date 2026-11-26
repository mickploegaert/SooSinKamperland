const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Controleert het Cloudflare Turnstile-token van het contactformulier.
 *
 * Zolang TURNSTILE_SECRET_KEY niet is ingesteld wordt de controle overgeslagen,
 * zodat het formulier lokaal werkt. Zodra de sleutel in de omgeving staat, is
 * een geldig token verplicht.
 */
export async function verifyTurnstile(token: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}
