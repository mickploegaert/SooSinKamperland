import { TableCard, td, th } from "@/components/dashboard/ui";
import type { SumUpTransaction } from "@/lib/data/types";
import { formatDateTime } from "@/lib/format";
import { formatEuro } from "@/lib/money";
import { PAYMENT_TYPE_LABELS, SUMUP_STATUS_LABELS } from "@/lib/sumup";

export function SumUpTable({ transactions }: { transactions: SumUpTransaction[] }) {
  return (
    <TableCard>
      <table className="w-full min-w-[680px]">
        <thead>
          <tr>
            <th className={th}>Datum</th>
            <th className={th}>Omschrijving</th>
            <th className={th}>Betaalwijze</th>
            <th className={th}>Status</th>
            <th className={`${th} text-right`}>Bedrag</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => {
            const status = SUMUP_STATUS_LABELS[t.status] ?? { label: t.status, className: "text-soos-muted" };
            return (
              <tr key={t.externalId}>
                <td className={`${td} whitespace-nowrap text-soos-muted`}>
                  <time dateTime={t.timestamp}>{formatDateTime(t.timestamp)}</time>
                </td>
                <td className={`${td} font-semibold`}>
                  {t.description ?? "Transactie"}
                  {t.transactionCode ? (
                    <span className="block text-xs font-normal text-soos-muted">{t.transactionCode}</span>
                  ) : null}
                </td>
                <td className={`${td} text-soos-muted`}>
                  {t.paymentType ? (PAYMENT_TYPE_LABELS[t.paymentType] ?? t.paymentType) : "—"}
                  {t.cardType && t.cardType !== "UNKNOWN" ? ` · ${t.cardType}` : ""}
                </td>
                <td className={`${td} font-semibold ${status.className}`}>{status.label}</td>
                <td className={`${td} whitespace-nowrap text-right font-semibold`}>
                  {t.currency === "EUR" ? formatEuro(t.amountCents) : `${(t.amountCents / 100).toFixed(2)} ${t.currency}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableCard>
  );
}
