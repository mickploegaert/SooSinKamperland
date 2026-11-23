"use client";

import { useEffect } from "react";
import { ButtonLink, buttonClass } from "@/components/button";
import { PageHero } from "@/components/page-hero";

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col bg-soos-mist">
      <PageHero eyebrow="Er ging iets mis" title="Oeps, er ging iets fout">
        Er is een onverwachte fout opgetreden. Probeer het opnieuw. Lukt het nog steeds niet,
        kom dan later terug of neem contact met ons op.
      </PageHero>
      <section className="relative z-10 -mt-16 px-4 pb-20">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-3 rounded-panel bg-white p-6 shadow-card-lift ring-1 ring-soos-dark/5 sm:p-10">
          <button type="button" onClick={() => retry()} className={buttonClass("primary")}>
            Probeer opnieuw
          </button>
          <ButtonLink href="/" variant="secondary">
            Naar de homepage
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Contact
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
