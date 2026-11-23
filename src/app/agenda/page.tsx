import type { Metadata } from "next";
import { connection } from "next/server";
import { PageCard, PageHero } from "@/components/page-hero";
import {
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
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-soos-purple">
                            {formatWeekday(item.date)}
                          </p>
                          <h3 className="text-lg font-semibold text-soos-dark">{item.name}</h3>
                          <p className="mt-1 text-sm leading-6 text-soos-ink/80">
                            {item.description}
                          </p>
                        </div>
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
