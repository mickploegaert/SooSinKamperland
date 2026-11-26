import type { Activity as StoredActivity } from "@/lib/data/types";

/** Een activiteit zoals de publieke pagina's die tonen (één datum per voorkomen). */
export type Activity = {
  name: string;
  date: string;
  description: string;
  image: string;
  imageAlt: string;
  category: string | null;
};

const FALLBACK_IMAGE = "/activiteiten/soos-1.jpg";
const FALLBACK_ALT = "Bezoekers in de soos onder de vlaggetjes en discoballen";

function addToIsoDate(isoDate: string, every: "week" | "month", count: number) {
  const [year, month, day] = isoDate.split("-").map(Number);
  let date: Date;
  if (every === "week") {
    date = new Date(Date.UTC(year, month - 1, day + 7 * count));
  } else {
    const target = new Date(Date.UTC(year, month - 1 + count, 1));
    const lastDay = new Date(
      Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
    ).getUTCDate();
    target.setUTCDate(Math.min(day, lastDay));
    date = target;
  }
  return date.toISOString().slice(0, 10);
}

/**
 * Zet opgeslagen activiteiten om naar de weergave op de website: alleen zichtbare
 * activiteiten die vandaag of later plaatsvinden, terugkerende activiteiten
 * uitgeschreven per datum, oplopend gesorteerd.
 */
export function toPublicActivities(rows: StoredActivity[], today: string): Activity[] {
  const result: Activity[] = [];
  for (const row of rows) {
    if (!row.isVisible) continue;
    const base = {
      name: row.name,
      description: row.description,
      image: row.imageUrl ?? FALLBACK_IMAGE,
      imageAlt: row.imageUrl ? `Afbeelding bij ${row.name}` : FALLBACK_ALT,
      category: row.category,
    };
    const dates = [row.startDate];
    if (row.repeatEvery && row.repeatUntil) {
      for (let count = 1; count < 200; count++) {
        const date = addToIsoDate(row.startDate, row.repeatEvery, count);
        if (date > row.repeatUntil) break;
        dates.push(date);
      }
    }
    for (const date of dates) {
      if (date >= today) result.push({ ...base, date });
      // Meerdaagse activiteit die nu bezig is: toon hem vandaag.
      else if (dates.length === 1 && row.endDate && row.endDate >= today) result.push({ ...base, date: today });
    }
  }
  return result.sort((a, b) => a.date.localeCompare(b.date));
}

export function formatActivityDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatDayMonth(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return {
    day: String(day),
    month: new Intl.DateTimeFormat("nl-NL", { month: "short", timeZone: "UTC" })
      .format(date)
      .replace(".", ""),
  };
}

export function formatMonthYear(isoDate: string) {
  const [year, month] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("nl-NL", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function formatWeekday(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("nl-NL", { weekday: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, day)),
  );
}

export function activitySlug(activity: Activity) {
  const name = activity.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${activity.date}-${name}`;
}
