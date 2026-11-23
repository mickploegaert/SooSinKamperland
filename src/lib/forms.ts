/** Gedeelde hulpfuncties voor formulieren in het dashboard. */

export type FormState = {
  /** Algemene foutmelding boven het formulier. */
  message?: string;
  /** Foutmelding per veldnaam. */
  errors?: Record<string, string>;
  /** Ingevulde waarden, zodat het formulier na een fout gevuld blijft. */
  values?: Record<string, string>;
};

export function formValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !key.startsWith("$")) values[key] = value;
  }
  return values;
}

export function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** Controleert een datum in het formaat JJJJ-MM-DD (zoals een date-input die verstuurt). */
export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

export function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

/** Absolute http(s)-URL of een pad binnen de site (bijv. /afbeeldingen/zaal.jpg). */
export function isValidUrlOrPath(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/** Meldingen die via ?melding=... na een redirect getoond worden. */
export const NOTICES = {
  toegevoegd: "Het item is toegevoegd.",
  opgeslagen: "De wijzigingen zijn opgeslagen.",
  verwijderd: "Het item is verwijderd.",
} as const;

export type NoticeKey = keyof typeof NOTICES;

export function noticeFrom(value: string | string[] | undefined): string | null {
  return typeof value === "string" && value in NOTICES ? NOTICES[value as NoticeKey] : null;
}
