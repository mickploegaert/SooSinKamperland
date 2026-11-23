import type { Metadata } from "next";
import Link from "next/link";
import { DashboardHeading, EmptyState, buttonSecondary } from "@/components/dashboard/ui";
import { RefreshButton } from "@/components/sumup/refresh-button";
import { SumUpStatus } from "@/components/sumup/sumup-status";
import { SumUpTable } from "@/components/sumup/sumup-table";
import { hasPermission, requireAdmin } from "@/lib/auth/dal";
import { formatEuro } from "@/lib/money";
import { loadSumUpOverview, PAYMENT_TYPE_LABELS } from "@/lib/sumup";
import { computeRegisterSummary } from "@/lib/sumup/register";

export const metadata: Metadata = { title: "Kassa" };

const RECENT_COUNT = 5;

export default async function RegisterPage() {
  const admin = await requireAdmin();

  if (!hasPermission(admin, "kassa:bekijken")) {
    return (
      <section>
        <DashboardHeading title="Kassa" />
        <p role="alert" className="mt-5 rounded-lg border border-soos-expense/30 bg-soos-expense-soft px-4 py-3 text-sm font-semibold text-soos-expense">
          Je hebt geen toegang tot de kassagegevens.
        </p>
      </section>
    );
  }

  const overview = await loadSumUpOverview();
  const summary = computeRegisterSummary(overview.transactions);
  const hasData = overview.transactions.length > 0;

  const cards = [
    { label: "Omzet vandaag", value: formatEuro(summary.revenueTodayCents), className: "bg-soos-income-soft" },
    { label: "Omzet afgelopen 7 dagen", value: formatEuro(summary.revenueWeekCents), className: "bg-soos-lilac" },
    { label: "Transacties vandaag", value: String(summary.transactionsToday), className: "bg-soos-surface" },
  ];

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <DashboardHeading
          title="Kassa"
          description="De kassagegevens uit SumUp, zonder dat je het SumUp-dashboard hoeft te openen."
        />
        <div className="flex flex-wrap gap-3">
          <RefreshButton />
          <a href="https://me.sumup.com" target="_blank" rel="noopener noreferrer" className={buttonSecondary}>
            SumUp-dashboard <span aria-hidden="true">↗</span>
            <span className="sr-only">(opent in een nieuw tabblad)</span>
          </a>
        </div>
      </div>

      <div className="mt-5 space-y-6">
        <SumUpStatus overview={overview} />

        {overview.status === "not-configured" ? null : (
          <>
            <dl className="grid gap-2 sm:grid-cols-3">
              {cards.map((card) => (
                <div key={card.label} className={`rounded-xl px-4 py-4 ${card.className}`}>
                  <dt className="text-xs font-semibold text-soos-muted">{card.label}</dt>
                  <dd className="mt-3 text-2xl font-bold text-soos-navy">{card.value}</dd>
                </div>
              ))}
            </dl>

            <div className="grid gap-6 xl:grid-cols-[1fr_18rem]">
              <div>
                <div className="flex items-end justify-between gap-4">
                  <h2 className="text-lg font-bold text-soos-navy">Laatste transacties</h2>
                  <Link href="/dashboard/sumup" className="text-sm font-semibold text-soos-violet hover:underline">
                    Alle SumUp-transacties →
                  </Link>
                </div>
                <div className="mt-3">
                  {hasData ? (
                    <SumUpTable transactions={overview.transactions.slice(0, RECENT_COUNT)} />
                  ) : overview.status === "ok" ? (
                    <EmptyState>Er zijn nog geen kassagegevens beschikbaar.</EmptyState>
                  ) : null}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-soos-navy">Per betaalwijze</h2>
                <p className="text-xs text-soos-muted">Geslaagde betalingen, afgelopen 7 dagen</p>
                {summary.byPaymentType.length === 0 ? (
                  <p className="mt-3 text-sm text-soos-muted">Nog geen betalingen.</p>
                ) : (
                  <ul className="mt-3 divide-y divide-soos-line rounded-lg border border-soos-line bg-white px-4">
                    {summary.byPaymentType.map((row) => (
                      <li key={row.paymentType} className="flex items-center justify-between gap-3 py-3 text-sm">
                        <span>
                          <span className="font-semibold text-soos-navy">
                            {PAYMENT_TYPE_LABELS[row.paymentType] ?? row.paymentType}
                          </span>
                          <span className="block text-xs text-soos-muted">
                            {row.count} {row.count === 1 ? "betaling" : "betalingen"}
                          </span>
                        </span>
                        <span className="font-semibold text-soos-navy">{formatEuro(row.totalCents)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
