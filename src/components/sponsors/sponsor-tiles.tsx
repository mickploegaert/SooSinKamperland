import type { Sponsor, SponsorLevel } from "@/lib/data/types";
import { SPONSOR_LEVELS } from "@/lib/data/types";

const tierStyles: Record<SponsorLevel, { card: string; title: string; star: string; amount: string }> = {
  goud: {
    card: "bg-gradient-to-b from-[#c79a6b] to-[#9c7048] text-white",
    title: "text-white",
    star: "fill-[#ffd23f] stroke-[#e0a800]",
    amount: "text-white",
  },
  zilver: {
    card: "bg-gradient-to-b from-[#f1f2f5] to-[#d9dbe1]",
    title: "text-soos-navy",
    star: "fill-[#dfe1e6] stroke-[#8d919b]",
    amount: "text-soos-navy",
  },
  brons: {
    card: "bg-gradient-to-b from-[#f1f2f5] to-[#d9dbe1]",
    title: "text-soos-navy",
    star: "fill-[#e9a066] stroke-[#b5652d]",
    amount: "text-soos-navy",
  },
};

function Star({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`size-8 stroke-[1.5] ${className}`}>
      <path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9Z" strokeLinejoin="round" />
    </svg>
  );
}

/** De drie sponsorpakketten (Goud, Zilver, Brons) uit het schermontwerp. */
export function SponsorTiers() {
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {SPONSOR_LEVELS.map((level) => {
        const style = tierStyles[level.value];
        return (
          <li key={level.value} className={`flex flex-col items-center gap-2 rounded-xl px-4 py-5 shadow-[0_2px_10px_rgba(17,17,43,0.08)] ${style.card}`}>
            <h3 className={`text-lg font-bold ${style.title}`}>{level.label}</h3>
            <Star className={style.star} />
            <p className={`text-base font-bold ${style.amount}`}>{level.amount}</p>
          </li>
        );
      })}
    </ul>
  );
}

function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  return sponsor.logoUrl ? (
    // Logo's komen van door beheerders opgegeven URL's.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={sponsor.logoUrl} alt={sponsor.name} className="max-h-14 w-auto max-w-[80%] object-contain" />
  ) : (
    <span className="text-center text-lg font-bold text-soos-navy">{sponsor.name}</span>
  );
}

/** Witte kaart met logo; klikbaar naar de website van de sponsor als die bekend is. */
export function SponsorTile({ sponsor }: { sponsor: Sponsor }) {
  const card =
    "flex h-24 items-center justify-center rounded-lg border border-soos-line bg-white px-4 shadow-[0_2px_10px_rgba(17,17,43,0.06)]";

  return (
    <div className="flex flex-col gap-2">
      {sponsor.websiteUrl ? (
        <a
          href={sponsor.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${card} transition-shadow hover:shadow-[0_6px_18px_rgba(17,17,43,0.14)]`}
          title={`Website van ${sponsor.name} (opent in een nieuw tabblad)`}
        >
          <SponsorLogo sponsor={sponsor} />
        </a>
      ) : (
        <div className={card}>
          <SponsorLogo sponsor={sponsor} />
        </div>
      )}
      {sponsor.description ? (
        <p className="px-1 text-xs leading-relaxed text-soos-muted">{sponsor.description}</p>
      ) : null}
    </div>
  );
}

export function HandshakeIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 32" className={`fill-none stroke-current stroke-2 ${className}`}>
      <path d="M2 8h7l6 14H8z" strokeLinejoin="round" />
      <path d="M46 8h-7l-6 14h7z" strokeLinejoin="round" />
      <path d="M15 22c3 0 4 1 6 3s4 4 6 2 1-3 1-3" strokeLinecap="round" />
      <path d="M33 10c-3-2-6-3-9-1l-6 4c-2 1-1 4 2 3l5-2 9 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 10c3-2 5-3 8-2" strokeLinecap="round" />
      <path d="M23 28c1 1 3 1 4-1M27 26c1 1 3 1 4-1" strokeLinecap="round" />
    </svg>
  );
}
