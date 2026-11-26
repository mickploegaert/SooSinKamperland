import type { Metadata } from "next";
import Link from "next/link";
import { buttonSecondary, DashboardHeading, Notice } from "@/components/dashboard/ui";
import { requireAdmin } from "@/lib/auth/dal";
import { getDatabase } from "@/lib/data";
import { todayIso } from "@/lib/format";
import { noticeFrom } from "@/lib/forms";
import { MonthCalendar } from "./month-calendar";

export const metadata: Metadata = { title: "Agenda" };

const monthTitle = new Intl.DateTimeFormat("nl-NL", { month: "long", year: "numeric", timeZone: "UTC" });

function shiftMonth(month: string, delta: number) {
  const [year, number] = month.split("-").map(Number);
  return new Date(Date.UTC(year, number - 1 + delta, 1)).toISOString().slice(0, 7);
}

const navButton =
  "inline-flex size-9 items-center justify-center rounded-md border border-soos-line bg-white text-lg font-semibold text-soos-violet transition-colors hover:bg-soos-lilac";

export default async function AgendaPage({ searchParams }: PageProps<"/dashboard/agenda">) {
  await requireAdmin();
  const params = await searchParams;
  const today = todayIso();
  const requested = typeof params.maand === "string" ? params.maand : "";
  const month = /^\d{4}-(0[1-9]|1[0-2])$/.test(requested) ? requested : today.slice(0, 7);

  const db = getDatabase();
  const [appointments, activities] = await Promise.all([db.appointments.list(), db.activities.list()]);

  const previous = shiftMonth(month, -1);
  const next = shiftMonth(month, 1);

  return (
    <section>
      <DashboardHeading
        title="Agenda"
        description="Afspraken en vergaderingen (paars) naast de activiteiten van de website (groen). Alleen beheerders zien deze agenda."
        action={{ href: `/dashboard/agenda/nieuw${month === today.slice(0, 7) ? "" : `?datum=${month}-01`}`, label: "+ Afspraak" }}
      />
      <Notice message={noticeFrom(params.melding)} />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/agenda?maand=${previous}`} aria-label="Vorige maand" className={navButton}>
            ‹
          </Link>
          <Link href={`/dashboard/agenda?maand=${next}`} aria-label="Volgende maand" className={navButton}>
            ›
          </Link>
          <h2 className="ml-2 min-w-40 text-xl font-bold capitalize text-soos-navy">
            {monthTitle.format(new Date(`${month}-01T00:00:00Z`))}
          </h2>
          {month !== today.slice(0, 7) ? (
            <Link href="/dashboard/agenda" className="ml-1 text-sm font-semibold text-soos-violet hover:underline">
              Vandaag
            </Link>
          ) : null}
        </div>
        <a href="/dashboard/agenda/pdf" download className={buttonSecondary}>
          Agenda downloaden (PDF)
        </a>
      </div>

      <div className="mt-4">
        <MonthCalendar month={month} today={today} appointments={appointments} activities={activities} />
      </div>
    </section>
  );
}
