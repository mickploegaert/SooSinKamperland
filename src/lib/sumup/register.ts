import type { SumUpTransaction } from "@/lib/data/types";
import { todayIso } from "@/lib/format";

export type RegisterSummary = {
  revenueTodayCents: number;
  revenueWeekCents: number;
  transactionsToday: number;
  byPaymentType: { paymentType: string; count: number; totalCents: number }[];
};

/** Kassacijfers op basis van geslaagde SumUp-transacties (vandaag en de afgelopen 7 dagen). */
export function computeRegisterSummary(
  transactions: SumUpTransaction[],
  now = new Date(),
): RegisterSummary {
  const today = todayIso(now);
  const weekStart = todayIso(new Date(now.getTime() - 6 * 86_400_000));
  const successful = transactions.filter((t) => t.status === "SUCCESSFUL" && t.currency === "EUR");

  let revenueTodayCents = 0;
  let revenueWeekCents = 0;
  let transactionsToday = 0;
  const perType = new Map<string, { count: number; totalCents: number }>();

  for (const t of successful) {
    const day = todayIso(new Date(t.timestamp));
    if (day === today) {
      revenueTodayCents += t.amountCents;
      transactionsToday += 1;
    }
    if (day >= weekStart && day <= today) {
      revenueWeekCents += t.amountCents;
      const key = t.paymentType ?? "UNKNOWN";
      const entry = perType.get(key) ?? { count: 0, totalCents: 0 };
      entry.count += 1;
      entry.totalCents += t.amountCents;
      perType.set(key, entry);
    }
  }

  return {
    revenueTodayCents,
    revenueWeekCents,
    transactionsToday,
    byPaymentType: [...perType.entries()]
      .map(([paymentType, entry]) => ({ paymentType, ...entry }))
      .sort((a, b) => b.totalCents - a.totalCents),
  };
}
