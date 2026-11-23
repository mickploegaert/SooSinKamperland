import { Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { MapEmbed } from "@/components/map-embed";
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
                    <Mail aria-hidden className="size-5" />
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
                    <MapPin aria-hidden className="size-5" />
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
              <div className="mt-4 inline-flex rounded-card bg-soos-dark p-3">
                <SocialIcons />
              </div>
            </div>
          </div>

          <div className="rounded-card bg-soos-mist/60 p-5 ring-1 ring-soos-dark/5 sm:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-soos-dark">Stuur een bericht</h2>
            <p className="mt-1 text-sm text-soos-ink/75">Alle velden zijn verplicht.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>

        <section aria-labelledby="route-titel" className="mt-14">
          <h2 id="route-titel" className="text-2xl font-bold tracking-tight text-soos-dark">
            Route
          </h2>
          <p className="mt-1 text-sm text-soos-ink/80">
            {contactInfo.street}, {contactInfo.postalCode} {contactInfo.city}
          </p>
          <div className="mt-5 overflow-hidden rounded-card ring-1 ring-soos-dark/10">
            <MapEmbed
              src={contactInfo.embedUrl}
              title={`Kaart met de locatie van Soos in Kamperland, ${contactInfo.street}, ${contactInfo.city}`}
            />
          </div>
        </section>
      </PageCard>
    </div>
  );
}
