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
