import Image from "next/image";
import { TextLink } from "@/components/button";
import { SectionHeading } from "@/components/section-heading";
import type { Sponsor } from "@/lib/data/types";
import { loadSponsors } from "@/lib/public-sponsors";

function Logos({ sponsors, hidden = false }: { sponsors: Sponsor[]; hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-6 pr-6 motion-safe:animate-[sponsor-scroll_45s_linear_infinite] motion-reduce:flex-wrap motion-reduce:justify-center"
    >
      {sponsors.map((sponsor) => (
        <li
          key={sponsor.id}
          className="group relative h-20 w-40 shrink-0 rounded-xl bg-white p-3 ring-1 ring-soos-dark/10"
        >
          <Image
            src={sponsor.logoUrl ?? "/icon.png"}
            alt={hidden ? "" : sponsor.name}
            unoptimized={sponsor.logoUrl?.startsWith("http")}
            fill
            sizes="160px"
            className="object-contain p-3 opacity-70 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0 motion-reduce:transition-none"
          />
        </li>
      ))}
    </ul>
  );
}

export async function SponsorStrip() {
  const { sponsors } = await loadSponsors();
  const withLogo = sponsors.filter((sponsor) => sponsor.logoUrl);
  if (withLogo.length === 0) return null;
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
          <Logos sponsors={withLogo} />
          <Logos sponsors={withLogo} hidden />
        </div>
      </div>
    </section>
  );
}
