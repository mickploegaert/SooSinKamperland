import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PageCard, PageHero } from "@/components/page-hero";
import { SocialIcons } from "@/components/social-icons";
import { contactInfo } from "@/lib/contact-info";

export const metadata: Metadata = {
  title: "Contact",
  description: "Neem contact op met Soos in Kamperland voor vragen, sponsoring of activiteiten.",
};

export default function ContactPage() {
  return (
    <div className="bg-soos-mist">
      <PageHero eyebrow="Zeg het maar" title="Contact">
        Een vraag, een idee of wil je sponsor worden? Stuur ons een bericht, dan nemen we zo
        snel mogelijk contact met je op.
      </PageHero>
      <PageCard>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-soos-dark">Gegevens</h2>
              <dl className="mt-5 space-y-5 text-base">
                <div className="flex gap-4">
                  <dt className="flex size-11 shrink-0 items-center justify-center rounded-full bg-soos-mist text-soos-purple">
                    <span className="sr-only">E-mail</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden className="size-5">
                      <rect x="3" y="5" width="18" height="14" rx="2.5" />
                      <path d="m4 7 8 6 8-6" />
                    </svg>
                  </dt>
                  <dd>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="font-semibold text-soos-dark underline decoration-soos-purple/30 underline-offset-4 hover:decoration-soos-purple"
                    >
                      {contactInfo.email}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-4">
                  <dt className="flex size-11 shrink-0 items-center justify-center rounded-full bg-soos-mist text-soos-purple">
                    <span className="sr-only">Adres</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden className="size-5">
                      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
                      <circle cx="12" cy="10" r="2.3" />
                    </svg>
                  </dt>
                  <dd>
                    <p className="font-semibold text-soos-dark">{contactInfo.street}</p>
                    <p>
                      {contactInfo.postalCode} {contactInfo.city}
                    </p>
                    <a
                      href={contactInfo.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm font-semibold text-soos-purple underline decoration-soos-purple/30 underline-offset-4 hover:decoration-soos-purple"
                    >
                      Bekijk op de kaart
                      <span className="sr-only"> (opent in een nieuw tabblad)</span>
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-soos-dark">Volg ons</h2>
              <p className="mt-2 text-base text-soos-ink/85">
                Blijf op de hoogte van onze activiteiten op social media.
              </p>
              <div className="mt-4 inline-flex rounded-2xl bg-soos-dark p-3">
                <SocialIcons />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-soos-mist/60 p-5 ring-1 ring-soos-dark/5 sm:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-soos-dark">Stuur een bericht</h2>
            <p className="mt-1 text-sm text-soos-ink/75">Alle velden zijn verplicht.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </PageCard>
    </div>
  );
}
