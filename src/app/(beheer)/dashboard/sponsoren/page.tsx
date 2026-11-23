import type { Metadata } from "next";
import Link from "next/link";
import { DashboardHeading, EmptyState, Notice, TableCard, td, th } from "@/components/dashboard/ui";
import { requireAdmin } from "@/lib/auth/dal";
import { getDatabase } from "@/lib/data";
import { SPONSOR_LEVELS } from "@/lib/data/types";
import { noticeFrom } from "@/lib/forms";

export const metadata: Metadata = { title: "Sponsoren" };

export default async function SponsorsPage({ searchParams }: PageProps<"/dashboard/sponsoren">) {
  await requireAdmin();
  const [sponsors, params] = await Promise.all([getDatabase().sponsors.list(), searchParams]);

  return (
    <section>
      <DashboardHeading
        title="Sponsoren"
        description="Beheer de sponsoren en Vrienden van de Soos. Wijzigingen zijn direct zichtbaar op de sponsorenpagina."
        action={{ href: "/dashboard/sponsoren/nieuw", label: "+ Sponsor" }}
      />
      <Notice message={noticeFrom(params.melding)} />

      <div className="mt-6">
        {sponsors.length === 0 ? (
          <EmptyState>Er zijn nog geen sponsoren toegevoegd.</EmptyState>
        ) : (
          <TableCard>
            <table className="w-full min-w-[680px]">
              <thead>
                <tr>
                  <th className={th}><span className="sr-only">Logo</span></th>
                  <th className={th}>Naam</th>
                  <th className={th}>Niveau</th>
                  <th className={th}>Soort</th>
                  <th className={th}>Website</th>
                  <th className={th}><span className="sr-only">Acties</span></th>
                </tr>
              </thead>
              <tbody>
                {sponsors.map((sponsor) => (
                  <tr key={sponsor.id}>
                    <td className={`${td} w-16`}>
                      {sponsor.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={sponsor.logoUrl} alt="" className="h-8 w-12 object-contain" />
                      ) : (
                        <span className="block h-8 w-12 rounded bg-soos-mist" />
                      )}
                    </td>
                    <td className={`${td} font-semibold`}>{sponsor.name}</td>
                    <td className={td}>
                      {SPONSOR_LEVELS.find((level) => level.value === sponsor.level)?.label ?? "—"}
                    </td>
                    <td className={`${td} text-soos-muted`}>{sponsor.isFriend ? "Vriend van de Soos" : "Sponsor"}</td>
                    <td className={`${td} max-w-48 truncate text-soos-muted`}>
                      {sponsor.websiteUrl ? new URL(sponsor.websiteUrl).hostname : "—"}
                    </td>
                    <td className={`${td} text-right`}>
                      <Link href={`/dashboard/sponsoren/${sponsor.id}`} className="font-semibold text-soos-violet hover:underline">
                        Bewerken<span className="sr-only"> {sponsor.name}</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        )}
      </div>
    </section>
  );
}
