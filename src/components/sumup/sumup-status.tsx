import { formatDateTime } from "@/lib/format";
import { SUMUP_UNAVAILABLE_MESSAGE, type SumUpOverview } from "@/lib/sumup";

/** Meldingen over de verbinding met SumUp (fout, niet gekoppeld of demomodus). */
export function SumUpStatus({ overview }: { overview: SumUpOverview }) {
  const synced = overview.lastSyncedAt ? (
    <> De laatst opgehaalde gegevens zijn van {formatDateTime(overview.lastSyncedAt)}.</>
  ) : null;

  if (overview.status === "unavailable") {
    return (
      <p role="alert" className="rounded-lg border border-soos-expense/30 bg-soos-expense-soft px-4 py-3 text-sm text-soos-expense">
        <strong className="font-semibold">{SUMUP_UNAVAILABLE_MESSAGE}</strong>
        {synced}
      </p>
    );
  }
  if (overview.status === "not-configured") {
    return (
      <p role="alert" className="rounded-lg border border-soos-expense/30 bg-soos-expense-soft px-4 py-3 text-sm text-soos-expense">
        <strong className="font-semibold">SumUp is nog niet gekoppeld.</strong> Stel SUMUP_API_KEY en
        SUMUP_MERCHANT_CODE in om transacties op te halen.
      </p>
    );
  }
  if (overview.mode === "demo") {
    return (
      <p role="status" className="rounded-lg bg-soos-lilac px-4 py-3 text-sm text-soos-violet">
        <strong className="font-semibold">Demomodus:</strong> er is nog geen SumUp API-sleutel ingesteld. De
        getoonde transacties zijn voorbeeldgegevens.
      </p>
    );
  }
  return null;
}
