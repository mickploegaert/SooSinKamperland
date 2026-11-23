import type { Metadata } from "next";
import { ButtonLink } from "@/components/button";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Pagina niet gevonden" };

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col bg-soos-mist">
      <PageHero eyebrow="Fout 404" title="Deze pagina bestaat niet">
        De pagina die je zoekt is verplaatst of bestaat niet (meer). Geen zorgen, we helpen je
        op weg.
      </PageHero>
      <section className="relative z-10 -mt-16 px-4 pb-20">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-3 rounded-[2rem] bg-white p-6 shadow-card-lift ring-1 ring-soos-dark/5 sm:p-10">
          <ButtonLink href="/" arrow>
            Naar de homepage
          </ButtonLink>
          <ButtonLink href="/activiteiten" variant="secondary">
            Bekijk activiteiten
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Contact
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
