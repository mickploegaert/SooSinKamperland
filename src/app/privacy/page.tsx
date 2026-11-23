import type { Metadata } from "next";
import { PageCard, PageHero } from "@/components/page-hero";
import { contactInfo } from "@/lib/contact-info";

export const metadata: Metadata = {
  title: "Privacyverklaring",
  description: "Lees hoe Soos in Kamperland omgaat met je persoonsgegevens.",
};

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "Wie zijn wij?",
    body: (
      <p>
        Soos in Kamperland is een vrijwilligersorganisatie die activiteiten organiseert voor
        jong en oud in en rond Kamperland. Wij zijn verantwoordelijk voor de
        verwerking van je persoonsgegevens, zoals beschreven in deze verklaring. Je bereikt ons
        via{" "}
        <a className="font-semibold text-soos-purple underline" href={`mailto:${contactInfo.email}`}>
          {contactInfo.email}
        </a>
        .
      </p>
    ),
  },
  {
    title: "Welke gegevens verzamelen wij?",
    body: (
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Contactformulier:</strong> je naam, e-mailadres, het gekozen onderwerp en je
          bericht.
        </li>
        <li>
          <strong>Aanmeldformulier:</strong> je naam, e-mailadres, de gekozen activiteit, het
          aantal personen en een eventuele opmerking.
        </li>
      </ul>
    ),
  },
  {
    title: "Waarvoor gebruiken wij ze?",
    body: (
      <p>
        Alleen om je bericht of aanmelding te beantwoorden en af te handelen. Wij gebruiken je
        gegevens niet voor reclame en verkopen ze niet door.
      </p>
    ),
  },
  {
    title: "Met wie delen wij gegevens?",
    body: (
      <>
        <p>
          Wij delen je gegevens niet met derden, behalve met partijen die nodig zijn om de
          website te laten werken:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <strong>Een e-maildienst</strong> om je bericht bij ons af te leveren.
          </li>
          <li>
            <strong>Cloudflare Turnstile</strong> om misbruik van de formulieren door
            geautomatiseerde programma&apos;s te voorkomen.
          </li>
          <li>
            <strong>Google Maps</strong> voor de kaart op de contactpagina. De kaart laden wij
            pas nadat je daarvoor kiest. Google ontvangt dan je IP-adres.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Cookies",
    body: (
      <p>
        Deze website plaatst zelf geen tracking- of advertentiecookies. Wij gebruiken geen
        analysetools die je volgen.
      </p>
    ),
  },
  {
    title: "Hoe lang bewaren wij gegevens?",
    body: (
      <p>
        Niet langer dan nodig is om je bericht of aanmelding af te handelen. Daarna verwijderen
        wij de gegevens.
      </p>
    ),
  },
  {
    title: "Jouw rechten",
    body: (
      <p>
        Je mag vragen welke gegevens wij van je hebben, ze laten corrigeren of laten verwijderen.
        Stuur daarvoor een e-mail naar{" "}
        <a className="font-semibold text-soos-purple underline" href={`mailto:${contactInfo.email}`}>
          {contactInfo.email}
        </a>
        . Ben je het niet eens met hoe wij omgaan met je gegevens? Dan kun je een klacht
        indienen bij de Autoriteit Persoonsgegevens.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-soos-mist">
      <PageHero eyebrow="Zo gaan wij met je gegevens om" title="Privacyverklaring">
        Wij vinden jouw privacy belangrijk. Hier lees je wat wij met je gegevens doen.
      </PageHero>
      <PageCard>
        <div className="mx-auto max-w-3xl space-y-10 text-base leading-8 text-soos-ink/90">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-bold tracking-tight text-soos-dark">{section.title}</h2>
              <div className="mt-3">{section.body}</div>
            </section>
          ))}
          <p className="text-sm text-soos-ink/70">Laatst bijgewerkt: 23 november 2026.</p>
        </div>
      </PageCard>
    </div>
  );
}
