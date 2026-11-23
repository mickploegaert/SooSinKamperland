import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { BackLink, DashboardHeading, EmptyState, Notice } from "@/components/dashboard/ui";
import { deleteTransaction, saveTransaction } from "@/lib/actions/transactions";
import { requireAdmin } from "@/lib/auth/dal";
import { getDatabase } from "@/lib/data";
import type { TransactionType } from "@/lib/data/types";
import { todayIso } from "@/lib/format";
import { noticeFrom, parseId } from "@/lib/forms";
import { TRANSACTION_TYPES } from "@/lib/transaction-types";
import { TransactionForm } from "./transaction-form";
import { TransactionTable } from "./transaction-table";

/** Gedeelde pagina's voor /dashboard/inkomsten en /dashboard/uitgaven. */

export async function TransactionListPage({
  type,
  notice,
}: {
  type: TransactionType;
  notice: string | string[] | undefined;
}) {
  await requireAdmin();
  const config = TRANSACTION_TYPES[type];
  const transactions = await getDatabase().transactions.listByType(type);

  return (
    <section>
      <DashboardHeading
        title={config.plural}
        description={config.description}
        action={{ href: `${config.path}/nieuw`, label: config.addLabel }}
      />
      <Notice message={noticeFrom(notice)} />
      <div className="mt-6">
        {transactions.length === 0 ? (
          <EmptyState>Er zijn nog geen {config.plural.toLowerCase()} geregistreerd.</EmptyState>
        ) : (
          <TransactionTable transactions={transactions} showType={false} />
        )}
      </div>
    </section>
  );
}

export async function NewTransactionPage({ type }: { type: TransactionType }) {
  await requireAdmin();
  const config = TRANSACTION_TYPES[type];
  return (
    <section>
      <BackLink href={config.path} label={config.plural} />
      <div className="mt-3">
        <DashboardHeading title={`${config.label} registreren`} />
      </div>
      <TransactionForm action={saveTransaction.bind(null, null)} type={type} today={todayIso()} />
    </section>
  );
}

export async function EditTransactionPage({ type, rawId }: { type: TransactionType; rawId: string }) {
  await requireAdmin();
  const id = parseId(rawId);
  const transaction = id ? await getDatabase().transactions.findById(id) : null;
  if (!transaction || transaction.type !== type) notFound();
  const config = TRANSACTION_TYPES[type];

  return (
    <section>
      <BackLink href={config.path} label={config.plural} />
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <DashboardHeading title={`${config.label} bewerken`} description={transaction.description} />
        <DeleteButton
          action={deleteTransaction.bind(null, transaction.id)}
          confirmText={`Weet je zeker dat je "${transaction.description}" wilt verwijderen?`}
        />
      </div>
      <TransactionForm
        action={saveTransaction.bind(null, transaction.id)}
        type={type}
        transaction={transaction}
        today={todayIso()}
      />
    </section>
  );
}
