import Link from "next/link";
import type { Activity, Appointment } from "@/lib/data/types";
import { formatTimeRange } from "@/lib/format";

const WEEKDAYS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

type Entry = {
  key: string;
  kind: "afspraak" | "activiteit";
  title: string;
  time: string | null;
  href: string;
};

const iso = (date: Date) => date.toISOString().slice(0, 10);

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 86_400_000);
}

/** Alle dagen van de maand, aangevuld tot hele weken (maandag t/m zondag). */
function monthDays(month: string) {
  const [year, number] = month.split("-").map(Number);
  const first = new Date(Date.UTC(year, number - 1, 1));
  const last = new Date(Date.UTC(year, number, 0));
  const start = addDays(first, -((first.getUTCDay() + 6) % 7));
  const end = addDays(last, 6 - ((last.getUTCDay() + 6) % 7));
  const days: { date: string; inMonth: boolean }[] = [];
  for (let day = start; day <= end; day = addDays(day, 1)) {
    days.push({ date: iso(day), inMonth: day.getUTCMonth() === number - 1 });
  }
  return days;
}

function entriesFor(date: string, appointments: Appointment[], activities: Activity[]): Entry[] {
  const fromAppointments = appointments
    .filter((item) => item.date === date)
    .map<Entry>((item) => ({
      key: `a${item.id}`,
      kind: "afspraak",
      title: item.title,
      time: formatTimeRange(item.startTime, item.endTime),
      href: `/dashboard/agenda/${item.id}`,
    }));
  const fromActivities = activities
    .filter((item) => item.startDate <= date && date <= (item.endDate ?? item.startDate))
    .map<Entry>((item) => ({
      key: `p${item.id}`,
      kind: "activiteit",
      title: item.name,
      time: formatTimeRange(item.startTime, item.endTime),
      href: `/dashboard/activiteiten/${item.id}`,
    }));
  return [...fromAppointments, ...fromActivities].sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
}

const chipClass = {
  afspraak: "bg-soos-violet text-white hover:bg-soos-violet-hover",
  activiteit: "bg-soos-income-soft text-soos-income hover:bg-[#d6f0e5]",
} as const;

function EntryChip({ entry }: { entry: Entry }) {
  return (
    <Link
      href={entry.href}
      title={`${entry.time ? `${entry.time} · ` : ""}${entry.title}${entry.kind === "activiteit" ? " (activiteit)" : ""}`}
      className={`block truncate rounded px-1.5 py-1 text-xs font-semibold leading-tight transition-colors ${chipClass[entry.kind]}`}
    >
      {entry.time ? <span className="font-normal opacity-90">{entry.time.slice(0, 5)} </span> : null}
      {entry.title}
    </Link>
  );
}

const dayLong = new Intl.DateTimeFormat("nl-NL", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

export function MonthCalendar({
  month,
  today,
  appointments,
  activities,
}: {
  month: string;
  today: string;
  appointments: Appointment[];
  activities: Activity[];
}) {
  const days = monthDays(month).map((day) => ({
    ...day,
    entries: entriesFor(day.date, appointments, activities),
  }));

  return (
    <>
      {/* Maandraster vanaf tablet */}
      <div className="hidden overflow-hidden rounded-lg border border-soos-line bg-white md:block">
        <div className="grid grid-cols-7 border-b border-soos-line bg-soos-surface">
          {WEEKDAYS.map((name) => (
            <div key={name} className="px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide text-soos-muted">
              {name}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const isToday = day.date === today;
            return (
              <div
                key={day.date}
                className={`min-h-28 border-b border-r border-soos-line p-1.5 [&:nth-child(7n)]:border-r-0 ${
                  day.inMonth ? "bg-white" : "bg-soos-surface/70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex size-7 items-center justify-center rounded-full text-sm font-semibold ${
                      isToday ? "bg-soos-violet text-white" : day.inMonth ? "text-soos-navy" : "text-soos-muted/60"
                    }`}
                  >
                    {Number(day.date.slice(8))}
                  </span>
                  {day.inMonth ? (
                    <Link
                      href={`/dashboard/agenda/nieuw?datum=${day.date}`}
                      aria-label={`Afspraak toevoegen op ${dayLong.format(new Date(`${day.date}T00:00:00Z`))}`}
                      className="flex size-6 items-center justify-center rounded text-base leading-none text-soos-muted/60 transition-colors hover:bg-soos-lilac hover:text-soos-violet"
                    >
                      +
                    </Link>
                  ) : null}
                </div>
                <div className="mt-1 space-y-1">
                  {day.entries.map((entry) => (
                    <EntryChip key={entry.key} entry={entry} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lijst per dag op kleine schermen */}
      <ul className="space-y-3 md:hidden">
        {days
          .filter((day) => day.inMonth && (day.entries.length > 0 || day.date === today))
          .map((day) => (
            <li key={day.date} className="rounded-lg border border-soos-line bg-white p-3">
              <p className={`text-sm font-bold capitalize ${day.date === today ? "text-soos-violet" : "text-soos-navy"}`}>
                {dayLong.format(new Date(`${day.date}T00:00:00Z`))}
                {day.date === today ? " · vandaag" : ""}
              </p>
              <div className="mt-2 space-y-1">
                {day.entries.length === 0 ? (
                  <p className="text-xs text-soos-muted">Geen afspraken.</p>
                ) : (
                  day.entries.map((entry) => <EntryChip key={entry.key} entry={entry} />)
                )}
              </div>
            </li>
          ))}
        {days.every((day) => !day.inMonth || day.entries.length === 0) ? (
          <li className="rounded-lg border border-dashed border-soos-line px-4 py-8 text-center text-sm text-soos-muted">
            Geen afspraken of activiteiten in deze maand.
          </li>
        ) : null}
      </ul>
    </>
  );
}
