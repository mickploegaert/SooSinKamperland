/** Bedragen worden als hele centen opgeslagen om afrondingsfouten te voorkomen. */

const whole = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const cents = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });

/** 245000 → "€ 2.450", 1250 → "€ 12,50" (zoals in het schermontwerp). */
export function formatEuro(amountCents: number): string {
  const absolute = Math.abs(amountCents);
  const formatter = absolute % 100 === 0 ? whole : cents;
  const text = formatter.format(absolute / 100).replace(/ /g, " ");
  return amountCents < 0 ? `− ${text}` : text;
}

/** Bedrag met teken: "+ € 350" of "− € 120". */
export function formatSignedEuro(amountCents: number, type: "inkomst" | "uitgave"): string {
  return `${type === "inkomst" ? "+" : "−"} ${formatEuro(Math.abs(amountCents))}`;
}

/** Voor een invoerveld: 1250 → "12,50". */
export function centsToInput(amountCents: number): string {
  return (amountCents / 100).toFixed(2).replace(".", ",");
}

/**
 * Leest een bedrag zoals een gebruiker het intypt: "12,50", "12.50", "€ 1.234,56".
 * Geeft het bedrag in centen terug, of null als het geen geldig bedrag is.
 */
export function parseEuroToCents(raw: string): number | null {
  let value = raw.replace(/[€\s]/g, "");
  if (!value) return null;

  if (value.includes(",")) {
    // Nederlandse notatie: punten zijn duizendtallen, komma is het decimaalteken.
    value = value.replace(/\./g, "").replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(value)) {
    // "1.234" zonder komma = duizendtallen.
    value = value.replace(/\./g, "");
  }

  if (!/^\d+(\.\d{1,2})?$/.test(value)) return null;
  const [euros, decimals = ""] = value.split(".");
  const result = Number(euros) * 100 + Number(decimals.padEnd(2, "0"));
  return Number.isSafeInteger(result) ? result : null;
}
