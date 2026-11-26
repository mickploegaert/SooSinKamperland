import { Award, Crown, ExternalLink, Medal, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/button";
import { PageCard, PageHero } from "@/components/page-hero";
import { SectionDivider } from "@/components/section-divider";
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

const toneStyles: Record<
  FriendTier["tone"],
  { ring: string; badge: string; price: string; icon: LucideIcon }
> = {
  gold: {
    ring: "from-[#f6d77a] via-[#e3b13f] to-[#b9852a]",
    badge: "bg-gradient-to-br from-[#f6d77a] to-[#c8922f] text-[#4a3207]",
    price: "text-[#f6d77a]",
    icon: Crown,
  },
  silver: {
    ring: "from-[#eceff4] via-[#b8bfcc] to-[#8b93a3]",
    badge: "bg-gradient-to-br from-[#f1f3f7] to-[#a4acbb] text-[#2f3441]",
    price: "text-[#e3e7ee]",
    icon: Award,
  },
  bronze: {
    ring: "from-[#e8b88a] via-[#c98a52] to-[#8f5a2c]",
    badge: "bg-gradient-to-br from-[#eec29a] to-[#b07440] text-[#3d230d]",
    price: "text-[#eec29a]",
    icon: Medal,
  },
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

            <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {friendTiers.map((tier) => {
                const tone = toneStyles[tier.tone];
                const Icon = tone.icon;
                return (
                  <li
                    key={tier.name}
                    className={`rounded-card bg-gradient-to-br p-[1.5px] transition duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${tone.ring}`}
                  >
                    <div className="flex h-full flex-col items-center rounded-[calc(1rem-1.5px)] bg-soos-deep px-5 py-7 text-center lg:flex-row lg:gap-5 lg:text-left xl:flex-col xl:text-center">
                      <span
                        aria-hidden
                        className={`flex size-14 shrink-0 items-center justify-center rounded-full shadow-inner ${tone.badge}`}
                      >
                        <Icon className="size-7" strokeWidth={1.75} />
                      </span>
                      <div className="mt-4 lg:mt-0 xl:mt-4">
                        <h3 className="text-lg font-semibold">{tier.name}</h3>
                        <p className={`mt-1 text-3xl font-bold ${tone.price}`}>
                          &euro;&nbsp;{tier.price}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
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
