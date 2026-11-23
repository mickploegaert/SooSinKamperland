import type { Metadata } from "next";
import { connection } from "next/server";
import { ContentSections } from "@/components/content-sections";
import { getDatabase } from "@/lib/data";
import type { Sponsor } from "@/lib/data/types";
import { getPageContent } from "@/lib/public-content";
import { friendTiers, type FriendTier } from "@/lib/sponsors";

export const metadata: Metadata = {
  title: "Sponsoren",
  description:
    "Deze bedrijven en vrienden ondersteunen Soos in Kamperland, zodat wij leuke activiteiten kunnen organiseren.",
};

const SPONSOR_URL = "https://www.soosinkamperland.nl/sponsorworden.php";

const toneStyles: Record<FriendTier["tone"], { ring: string; badge: string; price: string }> = {
  gold: {
    ring: "from-[#f6d77a] via-[#e3b13f] to-[#b9852a]",
    badge: "bg-gradient-to-br from-[#f6d77a] to-[#c8922f] text-[#4a3207]",
    price: "text-[#f6d77a]",
  },
  silver: {
    ring: "from-[#eceff4] via-[#b8bfcc] to-[#8b93a3]",
    badge: "bg-gradient-to-br from-[#f1f3f7] to-[#a4acbb] text-[#2f3441]",
    price: "text-[#e3e7ee]",
  },
  bronze: {
    ring: "from-[#e8b88a] via-[#c98a52] to-[#8f5a2c]",
    badge: "bg-gradient-to-br from-[#eec29a] to-[#b07440] text-[#3d230d]",
    price: "text-[#eec29a]",
  },
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

function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  if (!sponsor.logoUrl) {
    return (
      <span className="text-center text-xl font-bold text-soos-dark/70">{sponsor.name}</span>
    );
  }
  return (
    // Logo's kunnen ook externe URL's zijn die beheerders invullen, daarom geen next/image.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sponsor.logoUrl}
      alt={`Logo van ${sponsor.name}`}
      loading="lazy"
      className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
    />
  );
}

export default async function SponsorenPage() {
  const [all, content] = await Promise.all([loadSponsors(), getPageContent("sponsoren")]);
  const sponsors = (all ?? []).filter((sponsor) => !sponsor.isFriend);
  const friends = (all ?? []).filter((sponsor) => sponsor.isFriend);

  return (
    <div className="bg-soos-mist">
      <section className="relative isolate overflow-hidden bg-soos-dark text-white">
        <div
          aria-hidden
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-soos-purple/50 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-[#8a4be0]/30 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-28 pt-14 sm:pb-36 sm:pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
            Samen maken we het mogelijk
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl sm:leading-[1.05]">
            Onze sponsoren
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
            Dankzij deze bedrijven kunnen wij bingo&apos;s, filmmiddagen, knutselmiddagen en
            disco&apos;s organiseren voor kinderen en jongeren in en rond Kamperland. Hartelijk
            bedankt!
          </p>
        </div>
      </section>

      <section
        aria-labelledby="sponsoren-titel"
        className="relative z-10 -mt-20 px-4 sm:-mt-24"
      >
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-white px-5 py-10 shadow-[0_40px_80px_-48px_rgba(38,11,69,0.65)] ring-1 ring-soos-dark/5 sm:px-10 sm:py-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="sponsoren-titel"
                className="text-3xl font-bold tracking-tight text-soos-dark sm:text-4xl"
              >
                Sponsoren
              </h2>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-soos-purple">
                {sponsors.length === 1
                  ? "1 bedrijf steunt de soos"
                  : `${sponsors.length} bedrijven steunen de soos`}
              </p>
            </div>
          </div>

          {all === null ? (
            <p className="mt-10 rounded-xl bg-soos-mist px-6 py-8 text-soos-dark">
              De sponsoren kunnen op dit moment niet worden geladen. Probeer het later opnieuw.
            </p>
          ) : sponsors.length === 0 ? (
            <p className="mt-10 rounded-xl bg-soos-mist px-6 py-8 text-soos-dark">
              Binnenkort maken we hier onze sponsoren bekend.
            </p>
          ) : (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sponsors.map((sponsor) => (
              <li
                key={sponsor.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-soos-dark/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_-24px_rgba(83,21,165,0.45)] hover:ring-soos-purple/40"
              >
                <div className="relative flex h-48 items-center justify-center bg-gradient-to-b from-white to-soos-mist p-6">
                  <SponsorLogo sponsor={sponsor} />
                </div>
                <div className="flex flex-1 flex-col border-t border-soos-dark/5 p-5">
                  <h3 className="text-lg font-semibold text-soos-dark">{sponsor.name}</h3>
                  {sponsor.description ? (
                    <p className="mt-1 text-sm leading-6 text-soos-ink/80">
                      {sponsor.description}
                    </p>
                  ) : null}
                  {sponsor.websiteUrl ? (
                    <a
                      href={sponsor.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 self-start text-sm font-semibold text-soos-purple underline decoration-soos-purple/30 underline-offset-4 transition hover:decoration-soos-purple"
                    >
                      Bezoek website
                      <span aria-hidden>↗</span>
                      <span className="sr-only">(opent in een nieuw tabblad)</span>
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
          )}
        </div>
      </section>

      <section
        aria-labelledby="vrienden-titel"
        className="px-4 pb-20 pt-16 sm:pb-28 sm:pt-24"
      >
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-soos-dark px-6 py-12 text-white sm:px-12 sm:py-16">
          <div
            aria-hidden
            className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-soos-purple/40 blur-3xl"
          />
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                Word een vriend en mis niks
              </p>
              <h2
                id="vrienden-titel"
                className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Vrienden van de Soos
              </h2>
              <p className="mt-4 text-base leading-7 text-white/85">
                In de soos komt een Wall of Fame. Het logo van jouw bedrijf hangt daar op een
                kroon, ster of hart, versierd door de kinderen. Kies een rank die bij jou past
                en steun de soos.
              </p>
              <a
                href={SPONSOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-soos-dark shadow-lg shadow-black/20 transition hover:bg-soos-mist"
              >
                Word vriend van de soos
                <span className="sr-only"> (opent in een nieuw tabblad)</span>
              </a>
            </div>

            <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {friendTiers.map((tier) => {
                const tone = toneStyles[tier.tone];
                return (
                  <li
                    key={tier.name}
                    className={`rounded-2xl bg-gradient-to-br p-[1.5px] ${tone.ring}`}
                  >
                    <div className="flex h-full flex-col items-center rounded-[calc(1rem-1.5px)] bg-[#321259] px-5 py-7 text-center lg:flex-row lg:gap-5 lg:text-left xl:flex-col xl:text-center">
                      <span
                        aria-hidden
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl shadow-inner ${tone.badge}`}
                      >
                        ★
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
                  <li
                    key={friend.id}
                    className="group flex h-28 items-center justify-center rounded-2xl bg-white p-4"
                  >
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
