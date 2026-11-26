import { ChevronDown, Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { ContentSections } from "@/components/content-sections";
import { getPageContent } from "@/lib/public-content";
import { ContactForm } from "@/components/contact-form";
import { MapEmbed } from "@/components/map-embed";
import { PageCard, PageHero } from "@/components/page-hero";
import { SocialCards } from "@/components/social-icons";
import { contactInfo } from "@/lib/contact-info";

export const faqs = [
  {
    question: "Moet ik me aanmelden voor een activiteit?",
    answer:
      "Dat staat bij de activiteit. Aanmelden helpt ons om te weten hoeveel mensen er komen. Gebruik daarvoor de knop Aanmelden bij de activiteit.",
  },
  {
    question: "Wat kost het om mee te doen?",
    answer:
      "De kosten verschillen per activiteit. Heb je een vraag over de prijs, stuur ons dan een bericht, dan laten we het je weten.",
  },
  {
    question: "Voor wie zijn de activiteiten?",
    answer: "Voor iedereen: jong en oud uit Kamperland en omgeving is welkom.",
  },
  {
    question: "Hoe kan ik sponsor worden?",
    answer:
      "Kijk op de sponsorpagina bij Vrienden van de Soos. Daar kun je kiezen uit een gouden, zilveren of bronzen vriendschap.",
  },
  {
    question: "Kan ik helpen als vrijwilliger?",
    answer: "Graag. Stuur ons een bericht via het formulier, dan nemen we contact met je op.",
  },
];

export const metadata: Metadata = {
  title: "Contact",
  description: "Neem contact op met Soos in Kamperland voor vragen, sponsoring of activiteiten.",
};

export default async function ContactPage() {
  const content = await getPageContent("contact");
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
              <div className="mt-4">
                <SocialCards />
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

        <section aria-labelledby="faq-titel" className="mt-14">
          <h2 id="faq-titel" className="text-2xl font-bold tracking-tight text-soos-dark">
            Veelgestelde vragen
          </h2>
          <div className="mt-5 divide-y divide-soos-dark/10 overflow-hidden rounded-card ring-1 ring-soos-dark/10">
            {faqs.map((faq) => (
              <details key={faq.question} className="group bg-white">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-soos-dark transition hover:bg-soos-mist [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown
                    aria-hidden
                    className="size-5 shrink-0 text-soos-purple transition group-open:rotate-180 motion-reduce:transition-none"
                  />
                </summary>
                <p className="px-5 pb-5 text-base leading-7 text-soos-ink/85">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

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
      <ContentSections items={content} />
    </div>
  );
}
