import type { Metadata } from "next";
import Link from "next/link";
import { DashboardHeading, EmptyState, Notice, TableCard, td, th } from "@/components/dashboard/ui";
import { requireAdmin } from "@/lib/auth/dal";
import { getDatabase } from "@/lib/data";
import { formatDate, formatTimeRange, todayIso } from "@/lib/format";
import { noticeFrom } from "@/lib/forms";

export const metadata: Metadata = { title: "Activiteiten" };

export default async function ActivitiesPage({ searchParams }: PageProps<"/dashboard/activiteiten">) {
  await requireAdmin();
  const [activities, params] = await Promise.all([getDatabase().activities.list(), searchParams]);
  const today = todayIso();

  return (
    <section>
      <DashboardHeading
        title="Activiteiten"
        description="Voeg activiteiten toe, wijzig ze of verwijder ze. Wijzigingen zijn direct zichtbaar op de activiteitenpagina."
        action={{ href: "/dashboard/activiteiten/nieuw", label: "+ Activiteit" }}
      />
      <Notice message={noticeFrom(params.melding)} />

      <div className="mt-6">
        {activities.length === 0 ? (
          <EmptyState>Er zijn nog geen activiteiten toegevoegd.</EmptyState>
        ) : (
          <TableCard>
            <table className="w-full min-w-[640px]">
              <thead>
                <tr>
                  <th className={th}>Naam</th>
                  <th className={th}>Datum</th>
                  <th className={th}>Tijd</th>
                  <th className={th}>Status</th>
                  <th className={th}><span className="sr-only">Acties</span></th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => {
                  const past = (activity.endDate ?? activity.startDate) < today;
                  return (
                    <tr key={activity.id} className={past ? "opacity-60" : undefined}>
                      <td className={`${td} font-semibold`}>{activity.name}</td>
                      <td className={`${td} whitespace-nowrap`}>{formatDate(activity.startDate)}</td>
                      <td className={`${td} whitespace-nowrap text-soos-muted`}>
                        {formatTimeRange(activity.startTime, activity.endTime) ?? "—"}
                      </td>
                      <td className={td}>
                        {past ? (
                          <span className="font-semibold text-soos-muted">Verlopen</span>
                        ) : activity.isVisible ? (
                          <span className="font-semibold text-soos-income">Zichtbaar</span>
                        ) : (
                          <span className="font-semibold text-soos-expense">Verborgen</span>
                        )}
                      </td>
                      <td className={`${td} text-right`}>
                        <Link href={`/dashboard/activiteiten/${activity.id}`} className="font-semibold text-soos-violet hover:underline">
                          Bewerken<span className="sr-only"> {activity.name}</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableCard>
        )}
      </div>
    </section>
  );
}
