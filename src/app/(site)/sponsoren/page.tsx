import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/button";
import { PageCard, PageHero } from "@/components/page-hero";
import { SectionDivider } from "@/components/section-divider";
import { RankShape } from "@/components/rank-shapes";
import { SectionHeading } from "@/components/section-heading";
import type { Sponsor } from "@/lib/data/types";
import { getPageContent } from "@/lib/public-content";
import { loadSponsors } from "@/lib/public-sponsors";
import { friendTiers, type FriendTier } from "@/lib/sponsors";
import { ContentSections } from "@/components/content-sections";

export const metadata: Metadata = {
  title: "Sponsoren",
  description:
    "Deze bedrijven en vrienden ondersteunen Soos in Kamperland, zodat wij leuke activiteiten kunnen organiseren.",
};

const SPONSOR_URL = "https://www.soosinkamperland.nl/sponsorworden.php";

/** Elk papiertje hangt een beetje scheef, alsof het op de muur geplakt is. */
const cardTilt: Record<FriendTier["tone"], string> = {
  gold: "sm:-rotate-2",
  silver: "sm:rotate-1",
  bronze: "sm:-rotate-1",
};

function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  if (!sponsor.logoUrl) {
    return <span className="text-center text-xl font-bold text-soos-dark/70">{sponsor.name}</span>;
  }
  return (
    <Image
      src={sponsor.logoUrl}
      alt={`Logo van ${sponsor.name}`}
      unoptimized={sponsor.logoUrl.startsWith("http")}
      fill
      sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
      className="object-contain transition duration-300 group-hover:scale-105 motion-reduce:transition-none"
    />
  );
}

export default async function SponsorenPage() {
  const [{ sponsors, friends }, content] = await Promise.all([
    loadSponsors(),
    getPageContent("sponsoren"),
  ]);

  return (
    <div className="bg-soos-mist">
      <PageHero eyebrow="Samen maken we het mogelijk" title="Onze sponsoren">
        Dankzij deze bedrijven kunnen wij bingo&apos;s, filmmiddagen, knutselmiddagen en
        disco&apos;s organiseren voor jong en oud in en rond Kamperland. Hartelijk
        bedankt!
      </PageHero>

      <PageCard>
        <SectionHeading
          id="sponsoren-titel"
          eyebrow={`${sponsors.length} bedrijven steunen de soos`}
          title="Sponsoren"
        />

        <ul aria-labelledby="sponsoren-titel" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sponsors.map((sponsor) => (
            <li key={sponsor.id} className="soos-card group flex flex-col overflow-hidden">
              <div className="relative flex h-48 items-center justify-center bg-gradient-to-b from-white to-soos-mist p-6">
                <div className="relative h-full w-full">
                  <SponsorLogo sponsor={sponsor} />
                </div>
              </div>
              <div className="flex flex-1 flex-col border-t border-soos-dark/5 p-5">
                <h3 className="text-lg font-semibold text-soos-dark">{sponsor.name}</h3>
                {sponsor.description ? (
                  <p className="mt-1 text-sm leading-6 text-soos-ink/80">{sponsor.description}</p>
                ) : null}
                {sponsor.websiteUrl ? (
                  <a
                    href={sponsor.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-soos-purple underline decoration-soos-purple/30 underline-offset-4 transition hover:decoration-soos-purple"
                  >
                    Bezoek website
                    <ExternalLink aria-hidden className="size-4" />
                    <span className="sr-only">(opent in een nieuw tabblad)</span>
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </PageCard>

      <SectionDivider />

      <section
        id="vrienden"
        aria-labelledby="vrienden-titel"
        className="scroll-mt-20 px-4 pb-20 pt-14 sm:pb-28 sm:pt-20"
      >
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-panel bg-soos-dark px-6 py-12 text-white sm:px-12 sm:py-16">
          <div
            aria-hidden
            className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-soos-purple/40 blur-3xl"
          />
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
            <div>
              <SectionHeading
                id="vrienden-titel"
                tone="light"
                eyebrow="Word een vriend en mis niks"
                title="Vrienden van de Soos"
              />
              <p className="mt-4 text-base leading-7 text-white/85">
                In de soos komt een Wall of Fame. Het logo van jouw bedrijf hangt daar op een
                kroon, ster of hart, versierd door de kinderen. Kies een rank die bij jou past
                en steun de soos.
              </p>
              <div className="mt-8">
                <ButtonLink href={SPONSOR_URL} variant="light">
                  Word vriend van de soos
                </ButtonLink>
              </div>
            </div>

            <ul className="grid gap-6 pt-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {friendTiers.map((tier) => (
                <li
                  key={tier.name}
                  className={`relative rounded-card bg-soos-cream px-5 pb-6 pt-9 text-center text-soos-dark shadow-lg shadow-black/25 transition duration-300 hover:rotate-0 motion-reduce:transition-none lg:flex lg:items-center lg:gap-6 lg:py-6 lg:text-left xl:block xl:pb-6 xl:pt-9 xl:text-center ${cardTilt[tier.tone]}`}
                >
                  <span
                    aria-hidden
                    className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-3 rounded-[2px] bg-white/80 shadow-sm"
                  />
                  <RankShape tone={tier.tone} className="mx-auto size-16 shrink-0 lg:mx-0 xl:mx-auto" />
                  <div className="mt-3 lg:mt-0 xl:mt-3">
                    <h3 className="font-display text-lg font-semibold">{tier.name}</h3>
                    <p className="mt-0.5 text-2xl font-bold text-soos-purple">&euro;&nbsp;{tier.price}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {friends.length > 0 ? (
            <div className="relative mt-12 border-t border-white/15 pt-10">
              <h3 className="text-xl font-semibold">Onze vrienden</h3>
              <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {friends.map((friend) => (
                  <li key={friend.id} className="group relative flex h-28 items-center justify-center rounded-card bg-white p-4">
                    <SponsorLogo sponsor={friend} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <ContentSections items={content} />
    </div>
  );
}
