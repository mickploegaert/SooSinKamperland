import type { Metadata } from "next";
import Image from "next/image";
import { connection } from "next/server";
import { ActivityCard } from "@/components/activity-card";
import { ButtonLink, TextLink } from "@/components/button";
import { SectionDivider } from "@/components/section-divider";
import { SectionHeading } from "@/components/section-heading";
import { SponsorStrip } from "@/components/sponsor-strip";
import { upcomingActivities } from "@/lib/activities";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  await connection();
  const soon = upcomingActivities().slice(0, 3);

  return (
    <div className="flex flex-1 flex-col bg-soos-mist">
      <section className="relative isolate min-h-[36rem] overflow-hidden bg-soos-dark text-white sm:min-h-[42rem]">
        <Image
          src="/herosection.jpg"
          alt="Feestavond in Soos in Kamperland, met bezoekers aan tafels en slingers aan het plafond"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-soos-dark via-soos-dark/75 to-soos-dark/20" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-soos-mist" />
        <div className="relative mx-auto flex min-h-[36rem] max-w-6xl items-center px-4 pb-40 pt-16 sm:min-h-[42rem] sm:pb-48">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/75">
              Soos in Kamperland
            </p>
            <h1 className="mt-4 text-hero font-bold tracking-tight">
              Welkom bij Soos in Kamperland
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-white/90 sm:text-lg">
              Dé plek voor jong en oud in Kamperland. Bekijk onze activiteiten
              en meer!
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/activiteiten" arrow>
                Bekijk activiteiten
              </ButtonLink>
              <ButtonLink href="/sponsoren#vrienden" variant="ghost">
                Word sponsor
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-28 px-4 pb-16 sm:-mt-36 sm:pb-24">
        <div className="mx-auto max-w-6xl rounded-panel bg-white px-6 py-10 shadow-card-lift ring-1 ring-soos-dark/5 sm:px-12 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-soos-dark sm:text-4xl">
                Jong en oud welkom
              </h2>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-soos-purple">
                De leukste activiteiten vind je hier
              </p>
              <div className="mt-6">
                <TextLink href="/activiteiten">Lees meer</TextLink>
              </div>
            </div>
            <div className="space-y-4 text-base leading-8 text-soos-ink/90">
              <p>
                Onze komende activiteiten vind je op de activiteitenpagina. Ze
                zijn voor jong en oud: kinderen, jongeren en volwassenen in en
                rondom Kamperland.
              </p>
              <p>
                Word jij onze vriend van de soos? Wij zijn op zoek naar
                (jaarlijkse) sponsors die ons willen helpen om leuke
                activiteiten te organiseren. Het sponsorgeld gebruiken wij voor
                bingo&apos;s, filmmiddagen, knutselmiddagen, sloopmiddagen,
                disco&apos;s en nog veel meer!
              </p>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {soon.length > 0 ? (
        <section aria-labelledby="binnenkort-titel" className="px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              id="binnenkort-titel"
              eyebrow="De eerstvolgende activiteiten"
              title="Binnenkort in de soos"
              action={<TextLink href="/activiteiten">Alle activiteiten</TextLink>}
            />
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {soon.map((activity) => (
                <li key={`${activity.date}-${activity.name}`}>
                  <ActivityCard activity={activity} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <div className="mb-16 border-y border-soos-dark/10 bg-white py-14 sm:mb-24 sm:py-16">
        <SponsorStrip />
      </div>

      <section className="px-4 pb-20 sm:pb-28">
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 overflow-hidden rounded-panel bg-soos-dark px-6 py-12 text-white sm:flex-row sm:items-center sm:justify-between sm:px-12 sm:py-14">
          <div
            aria-hidden
            className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-soos-purple/50 blur-3xl"
          />
          <div className="relative max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Word een vriend van de soos
            </h2>
            <p className="mt-3 text-base leading-7 text-white/85">
              Steun onze activiteiten en hang jouw logo op de Wall of Fame. En mis niks.
            </p>
          </div>
          <div className="relative shrink-0">
            <ButtonLink href="/sponsoren#vrienden" variant="light" arrow>
              Bekijk de mogelijkheden
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
