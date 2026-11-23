import type { Metadata } from "next";
import Link from "next/link";
import { SummaryCards } from "@/components/finance/summary-cards";
import { TransactionTable } from "@/components/finance/transaction-table";
import { buttonPrimary, EmptyState } from "@/components/dashboard/ui";
import { requireAdmin } from "@/lib/auth/dal";
import { getDatabase } from "@/lib/data";
import type { FinancialTransaction } from "@/lib/data/types";
import { calculateSummary } from "@/lib/finance";

export const metadata: Metadata = { title: "Overzicht" };

const RECENT_COUNT = 6;

async function loadTransactions(): Promise<FinancialTransaction[] | null> {
  try {
    return await getDatabase().transactions.list();
  } catch (error) {
    console.error("Financiële gegevens konden niet worden opgehaald", error);
    return null;
  }
}

export default async function DashboardPage() {
  await requireAdmin();
  const transactions = await loadTransactions();

  return (
    <section aria-labelledby="overzicht-titel" className="flex min-h-full flex-col">
      <h1 id="overzicht-titel" className="sr-only">
        Financieel overzicht
      </h1>

      {transactions === null ? (
        <p role="alert" className="rounded-lg border border-soos-expense/30 bg-soos-expense-soft px-4 py-3 text-sm font-semibold text-soos-expense">
          De financiële gegevens kunnen op dit moment niet worden opgehaald. Probeer het later opnieuw.
        </p>
      ) : (
        <>
          <SummaryCards summary={calculateSummary(transactions)} />

          <h2 className="mt-8 text-lg font-bold text-soos-navy">Recente registraties</h2>
          <div className="mt-3">
            {transactions.length === 0 ? (
              <EmptyState>Er zijn nog geen inkomsten of uitgaven geregistreerd.</EmptyState>
            ) : (
              <TransactionTable
                transactions={transactions.slice(0, RECENT_COUNT)}
                showDate={false}
                editable={false}
              />
            )}
          </div>
          <div className="mt-4 flex flex-wrap justify-end gap-3">
            {transactions.length > RECENT_COUNT ? (
              <Link href="/dashboard/inkomsten" className="px-2 py-2.5 text-sm font-semibold text-soos-violet hover:underline">
                Alle registraties bekijken
              </Link>
            ) : null}
            <Link href="/dashboard/inkomsten/nieuw" className={buttonPrimary}>
              + Registratie
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
