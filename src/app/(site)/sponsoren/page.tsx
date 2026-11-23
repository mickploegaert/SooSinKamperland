import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { PageHero } from "@/components/activities/page-hero";
import { ContentSections } from "@/components/content-sections";
import { HandshakeIcon, SponsorTiers, SponsorTile } from "@/components/sponsors/sponsor-tiles";
import { getDatabase } from "@/lib/data";
import type { Sponsor } from "@/lib/data/types";
import { getPageContent } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Sponsoren",
  description: "Dankzij onze sponsoren kunnen wij mooie activiteiten organiseren.",
};

async function loadSponsors(): Promise<Sponsor[] | null> {
  await connection();
  try {
    return await getDatabase().sponsors.list();
  } catch (error) {
    console.error("Sponsoren konden niet worden geladen", error);
    return null;
  }
}

export default async function SponsorenPage() {
  const [all, content] = await Promise.all([loadSponsors(), getPageContent("sponsoren")]);
  const sponsors = (all ?? []).filter((sponsor) => !sponsor.isFriend);
  const friends = (all ?? []).filter((sponsor) => sponsor.isFriend);

  return (
    <>
      <PageHero
        title="Onze sponsoren"
        subtitle="Dankzij onze sponsoren kunnen wij mooie activiteiten organiseren."
      />

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6">
        <section aria-labelledby="hoofdsponsoren">
          <h2 id="hoofdsponsoren" className="mb-4 text-2xl font-bold text-soos-navy">Hoofdsponsoren</h2>
          <SponsorTiers />
        </section>

        <section aria-labelledby="onze-sponsoren">
          <h2 id="onze-sponsoren" className="mb-4 text-2xl font-bold text-soos-navy">Onze sponsoren</h2>
          {all === null ? (
            <p className="rounded-lg bg-soos-expense-soft px-4 py-6 text-center text-sm font-semibold text-soos-expense">
              De sponsoren kunnen op dit moment niet worden geladen. Probeer het later opnieuw.
            </p>
          ) : sponsors.length === 0 ? (
            <p className="rounded-lg border border-dashed border-soos-line px-4 py-10 text-center text-sm text-soos-muted">
              Binnenkort maken we hier onze sponsoren bekend.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {sponsors.map((sponsor) => (
                <li key={sponsor.id}>
                  <SponsorTile sponsor={sponsor} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {friends.length > 0 ? (
          <section aria-labelledby="vrienden" className="rounded-xl bg-soos-mist p-6">
            <h2 id="vrienden" className="text-2xl font-bold text-soos-navy">Vrienden van de Soos</h2>
            <p className="mt-1 text-sm text-soos-muted">
              Deze vrienden steunen Soos in Kamperland met een vaste bijdrage.
            </p>
            <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {friends.map((friend) => (
                <li key={friend.id}>
                  <SponsorTile sponsor={friend} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section
          aria-labelledby="sponsor-worden"
          className="flex flex-col gap-4 rounded-xl bg-soos-lilac px-6 py-5 sm:flex-row sm:items-center"
        >
          <HandshakeIcon className="h-10 w-14 shrink-0 text-soos-violet" />
          <div className="flex-1">
            <h2 id="sponsor-worden" className="text-lg font-bold text-soos-navy">Ook sponsor worden?</h2>
            <p className="text-sm text-soos-muted">Neem contact met ons op voor de mogelijkheden.</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-soos-violet px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-soos-violet-hover"
          >
            Contact opnemen <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>

      <ContentSections items={content} />
    </>
  );
}
