import type { FinancialTransaction } from "@/lib/data/types";

export type FinancialSummary = {
  totalIncomeCents: number;
  totalExpensesCents: number;
  balanceCents: number;
  incomeCount: number;
  expenseCount: number;
};

/** FinancialSummary uit het klassendiagram: totalen en saldo op basis van alle registraties. */
export function calculateSummary(transactions: FinancialTransaction[]): FinancialSummary {
  let totalIncomeCents = 0;
  let totalExpensesCents = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  for (const transaction of transactions) {
    if (transaction.type === "inkomst") {
      totalIncomeCents += transaction.amountCents;
      incomeCount += 1;
    } else {
      totalExpensesCents += transaction.amountCents;
      expenseCount += 1;
    }
  }

  return {
    totalIncomeCents,
    totalExpensesCents,
    balanceCents: totalIncomeCents - totalExpensesCents,
    incomeCount,
    expenseCount,
  };
}
