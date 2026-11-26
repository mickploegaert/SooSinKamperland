"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/button";
import {
  activitySlug,
  formatDayMonth,
  formatMonthYear,
  formatWeekday,
  type Activity,
} from "@/lib/activities";

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

const chip =
  "inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold ring-1 ring-inset transition aria-pressed:bg-soos-dark aria-pressed:text-white aria-pressed:ring-soos-dark bg-white text-soos-dark ring-soos-dark/15 hover:bg-soos-mist motion-reduce:transition-none";

export function AgendaList({
  items,
  currentMonth,
}: {
  items: Activity[];
  currentMonth: string;
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [thisMonth, setThisMonth] = useState(false);

  const categories = [...new Set(items.map((item) => item.category).filter((name): name is string => Boolean(name)))].sort();
  const visible = items.filter(
    (item) =>
      (!category || item.category === category) &&
      (!thisMonth || item.date.startsWith(currentMonth)),
  );
  const groups = groupByMonth(visible);

  return (
    <div>
      <div role="group" aria-label="Filter de agenda" className="flex flex-wrap gap-2">
        <button
          type="button"
          className={chip}
          aria-pressed={category === null && !thisMonth}
          onClick={() => {
            setCategory(null);
            setThisMonth(false);
          }}
        >
          Alles
        </button>
        <button
          type="button"
          className={chip}
          aria-pressed={thisMonth}
          onClick={() => setThisMonth((value) => !value)}
        >
          Deze maand
        </button>
        {categories.map((name) => (
          <button
            key={name}
            type="button"
            className={chip}
            aria-pressed={category === name}
            onClick={() => setCategory(category === name ? null : name)}
          >
            {name}
          </button>
        ))}
      </div>
      <p role="status" className="mt-3 text-sm text-soos-ink/75">
        {visible.length === 1 ? "1 activiteit" : `${visible.length} activiteiten`}
      </p>

      {groups.length === 0 ? (
        <p className="mt-6 rounded-card bg-soos-mist px-6 py-8 text-soos-dark">
          Geen activiteiten gevonden met dit filter.
        </p>
      ) : (
        <div className="mt-6 space-y-12">
          {groups.map((group) => (
            <section key={group.label} aria-label={group.label}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-soos-purple">
                {group.label}
              </h2>
              <ol className="mt-4 divide-y divide-soos-dark/10 overflow-hidden rounded-card ring-1 ring-soos-dark/10">
                {group.items.map((item) => {
                  const { day, month } = formatDayMonth(item.date);
                  return (
                    <li
                      key={`${item.date}-${item.name}`}
                      className="flex flex-wrap items-start gap-4 bg-white p-4 transition hover:bg-soos-mist sm:flex-nowrap sm:items-center sm:gap-6 sm:p-5"
                    >
                      <time
                        dateTime={item.date}
                        className="flex size-16 shrink-0 flex-col items-center justify-center rounded-card bg-soos-dark text-white"
                      >
                        <span className="text-2xl font-bold leading-none">{day}</span>
                        <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/75">
                          {month}
                        </span>
                      </time>
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-soos-purple">
                          {formatWeekday(item.date)}{item.category ? ` · ${item.category}` : ""}
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
                        className="ml-20 sm:ml-0"
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
    </div>
  );
}
