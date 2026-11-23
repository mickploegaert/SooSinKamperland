import Link from "next/link";
import { TableCard, td, th } from "@/components/dashboard/ui";
import type { FinancialTransaction } from "@/lib/data/types";
import { formatDate } from "@/lib/format";
import { formatSignedEuro } from "@/lib/money";
import { TRANSACTION_TYPES } from "@/lib/transaction-types";

/** Tabel in de stijl van "Recente registraties" uit het schermontwerp. */
export function TransactionTable({
  transactions,
  showType = true,
  showDate = true,
  editable = true,
}: {
  transactions: FinancialTransaction[];
  showType?: boolean;
  showDate?: boolean;
  editable?: boolean;
}) {
  return (
    <TableCard>
      <table className="w-full min-w-[520px]">
        <thead>
          <tr>
            <th className={th}>Omschrijving</th>
            {showDate ? <th className={th}>Datum</th> : null}
            {showType ? <th className={th}>Type</th> : null}
            <th className={th}>Bedrag</th>
            {editable ? (
              <th className={th}>
                <span className="sr-only">Acties</span>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => {
            const income = t.type === "inkomst";
            return (
              <tr key={t.id}>
                <td className={`${td} font-semibold`}>
                  {t.description}
                  {t.source === "sumup" ? (
                    <span className="ml-2 rounded bg-soos-lilac px-1.5 py-0.5 text-[10px] font-bold uppercase text-soos-violet">
                      SumUp
                    </span>
                  ) : null}
                </td>
                {showDate ? <td className={`${td} whitespace-nowrap text-soos-muted`}>{formatDate(t.date)}</td> : null}
                {showType ? (
                  <td className={`${td} font-semibold ${income ? "text-soos-income" : "text-soos-expense"}`}>
                    {TRANSACTION_TYPES[t.type].label}
                  </td>
                ) : null}
                <td className={`${td} whitespace-nowrap font-semibold`}>{formatSignedEuro(t.amountCents, t.type)}</td>
                {editable ? (
                  <td className={`${td} text-right`}>
                    <Link
                      href={`${TRANSACTION_TYPES[t.type].path}/${t.id}`}
                      className="font-semibold text-soos-violet hover:underline"
                    >
                      Bewerken<span className="sr-only"> {t.description}</span>
                    </Link>
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableCard>
  );
}
