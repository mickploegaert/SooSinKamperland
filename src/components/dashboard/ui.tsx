import Link from "next/link";

export const buttonPrimary =
  "inline-flex items-center justify-center gap-1.5 rounded-md bg-soos-violet px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-soos-violet-hover disabled:cursor-wait disabled:opacity-70";

export const buttonSecondary =
  "inline-flex items-center justify-center gap-1.5 rounded-md bg-soos-lilac px-5 py-2.5 text-sm font-semibold text-soos-violet transition-colors hover:bg-[#e3dcf6]";

export const buttonDanger =
  "inline-flex items-center justify-center gap-1.5 rounded-md border border-soos-expense/40 px-4 py-2 text-sm font-semibold text-soos-expense transition-colors hover:bg-soos-expense-soft disabled:cursor-wait disabled:opacity-70";

export function DashboardHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-soos-navy">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-sm text-soos-muted">{description}</p> : null}
      </div>
      {action ? (
        <Link href={action.href} className={buttonPrimary}>
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

export function Notice({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="status"
      className="mt-5 rounded-lg border border-soos-income/30 bg-soos-income-soft px-4 py-3 text-sm font-semibold text-soos-income"
    >
      {message}
    </p>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-soos-line px-4 py-10 text-center text-sm text-soos-muted">
      {children}
    </p>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="text-sm font-semibold text-soos-violet hover:underline">
      ← {label}
    </Link>
  );
}

/** Kader met rand rond tabellen, zoals "Recente registraties" in het ontwerp. */
export function TableCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-soos-line bg-white px-3 py-2 text-soos-navy">
      {children}
    </div>
  );
}

export const th = "px-2 py-3 text-left text-xs font-semibold text-soos-muted";
// Geen tekstkleur hier: die erft van TableCard, zodat cellen een eigen kleur kunnen krijgen.
export const td = "border-t border-soos-line px-2 py-4 text-sm";
