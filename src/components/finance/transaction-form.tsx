"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormError, SelectField, TextField } from "@/components/dashboard/form-fields";
import { buttonPrimary, buttonSecondary } from "@/components/dashboard/ui";
import type { FinancialTransaction, TransactionType } from "@/lib/data/types";
import type { FormState } from "@/lib/forms";
import { centsToInput } from "@/lib/money";
import { TRANSACTION_TYPES } from "@/lib/transaction-types";

export function TransactionForm({
  action,
  type,
  transaction,
  today,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  type: TransactionType;
  transaction?: FinancialTransaction;
  today: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} noValidate className="mt-6 max-w-xl space-y-5">
      <FormError state={state} />
      <SelectField
        name="type"
        label="Soort"
        required
        state={state}
        defaultValue={transaction?.type ?? type}
        options={[
          { value: "inkomst", label: "Inkomst" },
          { value: "uitgave", label: "Uitgave" },
        ]}
      />
      <TextField
        name="description"
        label="Omschrijving"
        required
        state={state}
        defaultValue={transaction?.description}
        placeholder={type === "inkomst" ? "bijv. Baromzet" : "bijv. Inkoop drank"}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="amount"
          label="Bedrag (€)"
          required
          inputMode="decimal"
          state={state}
          defaultValue={transaction ? centsToInput(transaction.amountCents) : ""}
          placeholder="0,00"
        />
        <TextField
          name="date"
          label="Datum"
          type="date"
          required
          state={state}
          defaultValue={transaction?.date ?? today}
        />
      </div>
      <div className="flex flex-wrap gap-3 pt-2">
        <button type="submit" disabled={pending} className={buttonPrimary}>
          {pending ? "Opslaan…" : "Opslaan"}
        </button>
        <Link href={TRANSACTION_TYPES[type].path} className={buttonSecondary}>
          Annuleren
        </Link>
      </div>
    </form>
  );
}
