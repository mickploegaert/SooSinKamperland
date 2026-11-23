const dateFormatter = new Intl.DateTimeFormat("nl-NL", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const dateTimeFormatter = new Intl.DateTimeFormat("nl-NL", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Amsterdam",
});

/** "2026-11-22" → "22 november 2026" */
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(`${isoDate.slice(0, 10)}T00:00:00Z`));
}

/** ISO-tijdstempel → "22 nov 2026 20:15" (Nederlandse tijd) */
export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}

const monthShort = new Intl.DateTimeFormat("nl-NL", { month: "short", timeZone: "UTC" });

/** "2026-11-22" → { day: "22", month: "NOV" } voor de datumbadge op activiteitkaarten. */
export function dateBadge(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return {
    day: String(date.getUTCDate()).padStart(2, "0"),
    month: monthShort.format(date).replace(".", "").toUpperCase(),
  };
}

/** "20:00" + "23:00" → "20:00 – 23:00" */
export function formatTimeRange(start: string | null, end: string | null): string | null {
  if (!start) return null;
  return end ? `${start} – ${end}` : start;
}

/** Datum van vandaag (JJJJ-MM-DD) in Nederlandse tijd. */
export function todayIso(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** "22 november" of, bij een ander jaar dan nu, "10 januari 2027". */
export function formatDayMonth(isoDate: string, today = todayIso()): string {
  const full = formatDate(isoDate);
  return isoDate.slice(0, 4) === today.slice(0, 4) ? full.replace(/\s\d{4}$/, "") : full;
}
