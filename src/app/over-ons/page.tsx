import { Clapperboard, Gift, Music, Palette, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/button";
import { PageCard, PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { team } from "@/lib/team";

export const metadata: Metadata = {
  title: "Over ons",
  description:
    "Maak kennis met de vrijwilligers van Soos in Kamperland en lees wat wij organiseren voor kinderen en jongeren.",
};

const doing: { label: string; text: string; icon: LucideIcon }[] = [
  { label: "Knutselen", text: "Creatief aan de slag met je vrienden.", icon: Palette },
  { label: "Bingo", text: "Een gezellige avond met mooie prijzen.", icon: Gift },
  { label: "Disco", text: "Dansen onder de discoballen.", icon: Music },
  { label: "Filmmiddag", text: "Samen een film kijken in de soos.", icon: Clapperboard },
];

export default function OverOnsPage() {
  return (
    <div className="bg-soos-mist">
      <PageHero eyebrow="Wij heten je welkom bij de Jeugd Soos" title="Over ons">
        Wie zijn wij en wat doen we? Hier lees je het verhaal van Soos in Kamperland.
      </PageHero>

      <PageCard>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <SectionHeading id="verhaal-titel" eyebrow="Wat is ons verhaal" title="De Jeugd Soos" />
          <div className="space-y-4 text-base leading-8 text-soos-ink/90">
            <p>
              De soos wordt gerund door een groep enthousiaste vrijwilligers die de nodige uren
              spenderen om leuke middag- en avondactiviteiten te organiseren voor kinderen en
              jongeren in en rond Kamperland.
            </p>
            <p>
              Hierbij moet je denken aan knutselen, een bingo, een disco of het samen kijken van
              een film. Het sponsorgeld dat we ontvangen, gebruiken we om deze activiteiten
              mogelijk te maken.
            </p>
          </div>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {doing.map(({ label, text, icon: Icon }) => (
            <li key={label} className="rounded-card bg-soos-mist p-5">
              <span
                aria-hidden
                className="flex size-11 items-center justify-center rounded-full bg-white text-soos-purple shadow-sm"
              >
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-soos-dark">{label}</h3>
              <p className="mt-1 text-sm leading-6 text-soos-ink/80">{text}</p>
            </li>
          ))}
        </ul>
      </PageCard>

      <section aria-labelledby="team-titel" className="px-4 pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading id="team-titel" eyebrow="De mensen achter de soos" title="Ons team" />
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <li key={member.name} className="soos-card group overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={member.photo}
                    alt={`Portret van ${member.name}`}
                    fill
                    sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none"
                  />
                </div>
                <p className="p-5 text-lg font-semibold text-soos-dark">{member.name}</p>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col items-start gap-4 rounded-panel bg-soos-dark p-8 text-white sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Wil je ons helpen?</h2>
              <p className="mt-2 max-w-lg text-white/85">
                Als sponsor of vriend van de soos help je ons om leuke activiteiten te blijven
                organiseren.
              </p>
            </div>
            <ButtonLink href="/sponsoren#vrienden" variant="light" arrow>
              Word sponsor
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
