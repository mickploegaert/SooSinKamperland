import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-soos-dark via-soos-dark to-soos-purple-hover text-white">
      <div
        aria-hidden
        className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-soos-purple/50 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-soos-glow/30 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-4 pb-28 pt-14 sm:pb-36 sm:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-2xl text-hero font-bold tracking-tight">{title}</h1>
        <div aria-hidden className="mt-5 h-1.5 w-16 rounded-full bg-soos-accent" />
        {children ? (
          <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg">{children}</p>
        ) : null}
      </div>
      <svg
        aria-hidden
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-8 w-full fill-soos-mist sm:h-12"
      >
        <path d="M0 48V28c180 22 360 22 540 8 200-16 400-34 620-16 100 8 190 18 280 28v0Z" />
      </svg>
    </section>
  );
}

export function PageCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className="relative z-10 -mt-20 px-4 pb-20 sm:-mt-24 sm:pb-28">
      <div
        className={`mx-auto max-w-6xl rounded-panel bg-white px-5 py-10 shadow-card-lift ring-1 ring-soos-dark/5 sm:px-10 sm:py-14 ${className}`}
      >
        {children}
      </div>
    </section>
  );
}
