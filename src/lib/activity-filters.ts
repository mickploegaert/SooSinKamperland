import type { Activity } from "@/lib/data/types";

export const DATE_FILTERS = [
  { value: "", label: "Alle data" },
  { value: "week", label: "Komende 7 dagen" },
  { value: "maand", label: "Deze maand" },
  { value: "volgende-maand", label: "Volgende maand" },
] as const;

function addDays(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function monthRange(isoDate: string, offset: number) {
  const date = new Date(`${isoDate.slice(0, 7)}-01T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + offset);
  const from = date.toISOString().slice(0, 10);
  date.setUTCMonth(date.getUTCMonth() + 1);
  date.setUTCDate(0);
  return { from, to: date.toISOString().slice(0, 10) };
}

export function dateRange(filter: string, today: string): { from: string; to: string } | null {
  switch (filter) {
    case "week":
      return { from: today, to: addDays(today, 6) };
    case "maand":
      return { from: today, to: monthRange(today, 0).to };
    case "volgende-maand":
      return monthRange(today, 1);
    default:
      return null;
  }
}

export function filterActivities(
  activities: Activity[],
  { category, date, today }: { category: string; date: string; today: string },
) {
  const range = dateRange(date, today);
  return activities.filter((activity) => {
    if (category && activity.category !== category) return false;
    if (range) {
      const end = activity.endDate ?? activity.startDate;
      if (activity.startDate > range.to || end < range.from) return false;
    }
    return true;
  });
}

export function categoriesOf(activities: Activity[]): string[] {
  return [...new Set(activities.map((a) => a.category).filter((c): c is string => Boolean(c)))].sort(
    (a, b) => a.localeCompare(b, "nl"),
  );
}
