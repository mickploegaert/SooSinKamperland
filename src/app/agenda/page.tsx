import type { Metadata } from "next";
import { connection } from "next/server";
import { CalendarPlus } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { PageCard, PageHero } from "@/components/page-hero";
import {
  activitySlug,
  formatDayMonth,
  formatMonthYear,
  formatWeekday,
  upcomingActivities,
  type Activity,
} from "@/lib/activities";

export const metadata: Metadata = { title: "Agenda" };

function groupByMonth(items: Activity[]) {
  const groups: { label: string; items: Activity[] }[] = [];
  for (const item of items) {
    const label = formatMonthYear(item.date);
    const last = groups[groups.length - 1];
    if (last?.label === label) last.items.push(item);
    else groups.push({ label, items: [item] });
  }
  return groups;
}

export default async function AgendaPage() {
  await connection();
  const groups = groupByMonth(upcomingActivities());

  return (
    <div className="bg-soos-mist">
      <PageHero eyebrow="Alles op een rij" title="Agenda">
        Zet het in je agenda: dit zijn de komende activiteiten, per maand.
      </PageHero>
      <PageCard>
        {groups.length === 0 ? (
          <p className="rounded-2xl bg-soos-mist px-6 py-8 text-soos-dark">
            Er staan nu geen activiteiten in de agenda.
          </p>
        ) : (
          <div className="space-y-12">
            <div className="flex flex-col gap-4 rounded-2xl bg-soos-mist p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <CalendarPlus aria-hidden className="mt-0.5 size-6 shrink-0 text-soos-purple" />
                <p className="text-sm leading-6 text-soos-ink/90">
                  <span className="font-semibold text-soos-dark">Zet alles in je eigen agenda.</span>{" "}
                  Download een agendabestand en open het in Google Agenda, Outlook of Apple Agenda.
                </p>
              </div>
              <a
                href="/agenda.ics"
                download
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-soos-purple px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-soos-purple/25 transition hover:bg-[#3f1080] active:scale-[0.98]"
              >
                Download agenda (.ics)
              </a>
            </div>
            {groups.map((group) => (
              <section key={group.label} aria-label={group.label}>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-soos-purple">
                  {group.label}
                </h2>
                <ol className="mt-4 divide-y divide-soos-dark/10 overflow-hidden rounded-2xl ring-1 ring-soos-dark/10">
                  {group.items.map((item) => {
                    const { day, month } = formatDayMonth(item.date);
                    return (
                      <li
                        key={`${item.date}-${item.name}`}
                        className="flex items-start gap-4 bg-white p-4 transition hover:bg-soos-mist sm:items-center sm:gap-6 sm:p-5"
                      >
                        <time
                          dateTime={item.date}
                          className="flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-soos-dark text-white"
                        >
                          <span className="text-2xl font-bold leading-none">{day}</span>
                          <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/75">
                            {month}
                          </span>
                        </time>
                        <div className="flex-1">
                          <p className="text-xs font-semibold uppercase tracking-wider text-soos-purple">
                            {formatWeekday(item.date)}
                          </p>
                          <h3 className="text-lg font-semibold text-soos-dark">{item.name}</h3>
                          <p className="mt-1 text-sm leading-6 text-soos-ink/80">
                            {item.description}
                          </p>
                        </div>
                        <ButtonLink
                          href={`/aanmelden?activiteit=${activitySlug(item)}`}
                          variant="secondary"
                          size="sm"
                          className="hidden sm:inline-flex"
                        >
                          Aanmelden
                          <span className="sr-only"> voor {item.name}</span>
                        </ButtonLink>
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}
          </div>
        )}
      </PageCard>
    </div>
  );
}
