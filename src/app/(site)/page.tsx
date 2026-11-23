import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContentSections, Paragraphs } from "@/components/content-sections";
import { getPageContent, splitHero } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  const { hero, sections } = splitHero(await getPageContent("home"));

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
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl sm:leading-[1.05]">
              {hero?.title ?? "Welkom bij Soos in Kamperland"}
            </h1>
            <div className="mt-5 max-w-md space-y-3 text-base leading-7 text-white/90 sm:text-lg">
              <Paragraphs
                text={
                  hero?.body ??
                  "Dé plek voor jong en oud in Kamperland. Bekijk onze activiteiten en meer!"
                }
              />
            </div>
            <Link
              href="/activiteiten"
              className="mt-8 inline-flex rounded-full bg-soos-purple px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-[#3f1080]"
            >
              Bekijk activiteiten
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-28 flex-1 px-4 pb-20 sm:-mt-36 sm:pb-28">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-white px-6 py-10 shadow-[0_40px_80px_-48px_rgba(38,11,69,0.65)] ring-1 ring-soos-dark/5 sm:px-12 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-soos-dark sm:text-4xl">
                Jong en oud welkom
              </h2>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-soos-purple">
                De leukste activiteiten vind je hier
              </p>
              <Link
                href="/activiteiten"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-soos-dark underline decoration-soos-purple/40 underline-offset-4 transition hover:decoration-soos-purple"
              >
                Lees meer
                <span aria-hidden>→</span>
              </Link>
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
      <ContentSections items={sections} />
    </div>
  );
}
