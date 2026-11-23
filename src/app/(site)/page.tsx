import type { Metadata } from "next";
import Link from "next/link";
import { ContentSections, Paragraphs } from "@/components/content-sections";
import { getPageContent, splitHero } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  const { hero, sections } = splitHero(await getPageContent("home"));

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h1 className="text-4xl font-bold tracking-tight text-soos-dark sm:text-5xl">
          {hero?.title ?? "Welkom bij Soos in Kamperland"}
        </h1>
        <div className="mt-4 max-w-2xl space-y-3 text-base">
          <Paragraphs
            text={
              hero?.body ??
              "Dé plek voor jong en oud in Kamperland. Bekijk onze activiteiten, zalen en meer!"
            }
          />
        </div>
        <Link
          href="/activiteiten"
          className="mt-8 inline-flex rounded-full bg-soos-purple px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3f1080]"
        >
          Bekijk activiteiten
        </Link>
      </div>
      <ContentSections items={sections} />
    </>
  );
}
