import type { ReactNode } from "react";

export function SectionHeading({
  id,
  title,
  eyebrow,
  action,
  tone = "dark",
}: {
  id?: string;
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p
            className={`text-xs font-semibold uppercase tracking-[0.2em] ${
              light ? "text-white/70" : "text-soos-purple"
            }`}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2
          id={id}
          className={`mt-2 text-section font-bold tracking-tight ${
            light ? "text-white" : "text-soos-dark"
          }`}
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
