import Link from "next/link";
import type { FinancialSummary } from "@/lib/finance";
import { formatEuro } from "@/lib/money";

/** De drie gekleurde kaarten bovenaan het dashboard uit het schermontwerp. */
export function SummaryCards({ summary }: { summary: FinancialSummary }) {
  const cards = [
    {
      label: "Inkomsten",
      value: summary.totalIncomeCents,
      className: "bg-soos-income-soft",
      href: "/dashboard/inkomsten",
      detail: `${summary.incomeCount} ${summary.incomeCount === 1 ? "registratie" : "registraties"}`,
    },
    {
      label: "Uitgaven",
      value: summary.totalExpensesCents,
      className: "bg-soos-expense-soft",
      href: "/dashboard/uitgaven",
      detail: `${summary.expenseCount} ${summary.expenseCount === 1 ? "registratie" : "registraties"}`,
    },
    {
      label: "Huidig saldo",
      value: summary.balanceCents,
      className: "bg-soos-lilac",
      href: null,
      detail: "Inkomsten min uitgaven",
    },
  ];

  return (
    <dl className="grid gap-2 sm:grid-cols-3">
      {cards.map((card) => {
        const content = (
          <>
            <dt className="text-xs font-semibold text-soos-muted">{card.label}</dt>
            <dd className={`mt-3 text-2xl font-bold ${card.value < 0 ? "text-soos-expense" : "text-soos-navy"}`}>
              {formatEuro(card.value)}
            </dd>
            <dd className="sr-only">{card.detail}</dd>
          </>
        );
        return (
          <div key={card.label} className={`rounded-xl ${card.className}`}>
            {card.href ? (
              <Link
                href={card.href}
                title={`${card.label} bekijken`}
                className="block rounded-xl px-4 py-4 transition-shadow hover:shadow-[0_4px_14px_rgba(17,17,43,0.1)]"
              >
                {content}
              </Link>
            ) : (
              <div className="px-4 py-4">{content}</div>
            )}
          </div>
        );
      })}
    </dl>
  );
}
