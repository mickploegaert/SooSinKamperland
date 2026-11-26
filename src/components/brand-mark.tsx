import Image from "next/image";

type BrandMarkProps = {
  /** "light" = witte tekst voor donkere achtergronden, "dark" = donkere tekst voor lichte achtergronden. */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Het logo van Soos in Kamperland met de naam ernaast, zoals in de header van
 * de website (src/components/site-header.tsx).
 */
export function BrandMark({ tone = "dark", className = "" }: BrandMarkProps) {
  const color = tone === "light" ? "text-white" : "text-soos-dark";

  return (
    <span className={`inline-flex items-center gap-3 ${color} ${className}`}>
      <Image
        src="/soos.png"
        alt=""
        width={48}
        height={48}
        priority
        className="size-11 shrink-0 rounded-full bg-white object-cover sm:size-12"
      />
      <span className="flex flex-col leading-tight">
        <span className="font-display text-base font-bold sm:text-lg">Soos in Kamperland</span>
        <span
          className={`hidden text-[0.7rem] font-medium uppercase tracking-[0.2em] sm:block ${
            tone === "light" ? "text-white/70" : "text-soos-muted"
          }`}
        >
          Jong &amp; oud welkom
        </span>
      </span>
    </span>
  );
}
