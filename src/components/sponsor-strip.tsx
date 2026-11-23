import Image from "next/image";
import { TextLink } from "@/components/button";
import { SectionHeading } from "@/components/section-heading";
import { sponsors } from "@/lib/sponsors";

function Logos({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-6 pr-6 motion-safe:animate-[sponsor-scroll_45s_linear_infinite] motion-reduce:flex-wrap motion-reduce:justify-center"
    >
      {sponsors.map((sponsor) => (
        <li
          key={sponsor.name}
          className="relative h-20 w-40 shrink-0 rounded-xl bg-white p-3 ring-1 ring-soos-dark/10"
        >
          <Image
            src={sponsor.logo}
            alt={hidden ? "" : sponsor.name}
            fill
            sizes="160px"
            className="object-contain p-3"
          />
        </li>
      ))}
    </ul>
  );
}

export function SponsorStrip() {
  return (
    <section aria-labelledby="sponsor-strip-titel" className="px-4 pb-4">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="sponsor-strip-titel"
          eyebrow="Onze sponsoren"
          title="Mogelijk gemaakt door"
          action={<TextLink href="/sponsoren">Alle sponsoren</TextLink>}
        />
      </div>
      <div className="mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:[mask-image:none]">
        <div className="flex w-max motion-reduce:w-full motion-reduce:flex-wrap">
          <Logos />
          <Logos hidden />
        </div>
      </div>
    </section>
  );
}
