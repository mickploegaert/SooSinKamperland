import { activityGradient } from "./activity-card";

/** Paarse kopbalk uit de schermontwerpen (activiteitenoverzicht en -detail). */
export function PageHero({
  title,
  subtitle,
  overline,
  imageUrl,
  size = "default",
}: {
  title: string;
  subtitle?: React.ReactNode;
  overline?: string;
  imageUrl?: string | null;
  size?: "default" | "large";
}) {
  return (
    <div className={`relative overflow-hidden ${activityGradient}`}>
      {imageUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#10112f]/95 to-[#6e2295]/70" />
        </>
      ) : null}
      <div
        className={`relative mx-auto max-w-6xl px-4 text-white sm:px-6 ${
          size === "large" ? "py-14 sm:py-20" : "py-10 sm:py-12"
        }`}
      >
        {overline ? (
          <p className="text-xs font-bold uppercase tracking-wider text-white/85">{overline}</p>
        ) : null}
        <h1
          className={`font-bold tracking-tight ${
            size === "large" ? "mt-3 text-4xl sm:text-5xl" : "text-4xl sm:text-[2.75rem]"
          }`}
        >
          {title}
        </h1>
        {subtitle ? <p className={`${size === "large" ? "mt-4" : "mt-3"} text-base text-white/90`}>{subtitle}</p> : null}
      </div>
    </div>
  );
}
