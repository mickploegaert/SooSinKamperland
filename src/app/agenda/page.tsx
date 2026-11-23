import type { Metadata } from "next";
import { connection } from "next/server";
import { CalendarPlus } from "lucide-react";
import { AgendaList } from "@/components/agenda-list";
import { PageCard, PageHero } from "@/components/page-hero";
import { upcomingActivities } from "@/lib/activities";

export const metadata: Metadata = { title: "Agenda" };

export default async function AgendaPage() {
  await connection();
  const items = upcomingActivities();
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className="bg-soos-mist">
      <PageHero eyebrow="Alles op een rij" title="Agenda">
        Zet het in je agenda: dit zijn de komende activiteiten, per maand.
      </PageHero>
      <PageCard>
        {items.length === 0 ? (
          <p className="rounded-card bg-soos-mist px-6 py-8 text-soos-dark">
            Er staan nu geen activiteiten in de agenda.
          </p>
        ) : (
          <div className="space-y-12">
            <div className="flex flex-col gap-4 rounded-card bg-soos-mist p-5 sm:flex-row sm:items-center sm:justify-between">
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
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-soos-purple px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-soos-purple/25 transition hover:bg-soos-purple-hover active:scale-[0.98]"
              >
                Download agenda (.ics)
              </a>
            </div>
            <AgendaList items={items} currentMonth={currentMonth} />
          </div>
        )}
      </PageCard>
    </div>
  );
}
