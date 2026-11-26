import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardHeading, EmptyState } from "@/components/dashboard/ui";
import { RefreshButton } from "@/components/sumup/refresh-button";
import { SumUpStatus } from "@/components/sumup/sumup-status";
import { SumUpTable } from "@/components/sumup/sumup-table";
import { requireAdmin } from "@/lib/auth/dal";
import { isSumUpEnabled } from "@/lib/sumup/feature";
import { loadSumUpOverview } from "@/lib/sumup";

export const metadata: Metadata = { title: "SumUp-transacties" };

export default async function SumUpPage() {
  await requireAdmin();
  // Staat uit tot de SumUp-koppeling getest is (SUMUP_ENABLED=true).
  if (!isSumUpEnabled()) notFound();
  const overview = await loadSumUpOverview();

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <DashboardHeading
          title="SumUp-transacties"
          description="Transacties van de SumUp-kassa met bedrag, datum en status. Iedere transactie wordt maar één keer getoond."
        />
        <RefreshButton />
      </div>

      <div className="mt-5 space-y-5">
        <SumUpStatus overview={overview} />
        {overview.transactions.length === 0 ? (
          overview.status === "ok" ? <EmptyState>Er zijn nog geen SumUp-transacties.</EmptyState> : null
        ) : (
          <SumUpTable transactions={overview.transactions} />
        )}
      </div>
    </section>
  );
}
