import { activitySlug, type Activity } from "@/lib/activities";

function escapeText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function compactDate(isoDate: string) {
  return isoDate.replace(/-/g, "");
}

function nextDay(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + 1));
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

/** Bouwt een iCalendar-bestand met hele-dag-afspraken voor de gegeven activiteiten. */
export function buildIcs(items: Activity[], location: string) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Soos in Kamperland//Agenda//NL",
    "CALSCALE:GREGORIAN",
    "X-WR-CALNAME:Soos in Kamperland",
  ];

  for (const item of items) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${activitySlug(item)}@soosinkamperland`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compactDate(item.date)}`,
      `DTEND;VALUE=DATE:${nextDay(item.date)}`,
      `SUMMARY:${escapeText(item.name)}`,
      `DESCRIPTION:${escapeText(item.description)}`,
      `LOCATION:${escapeText(location)}`,
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}
