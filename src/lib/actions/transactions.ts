"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import { getDatabase } from "@/lib/data";
import type { FinancialTransactionInput, TransactionType } from "@/lib/data/types";
import { type FormState, formValues, isValidDate, text } from "@/lib/forms";
import { parseEuroToCents } from "@/lib/money";
import { isTransactionType, TRANSACTION_TYPES } from "@/lib/transaction-types";

const MAX_CENTS = 99_999_999_99; // DECIMAL(10,2)

function revalidateFinance() {
  revalidatePath("/dashboard", "layout");
}

export async function saveTransaction(
  id: number | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const admin = await requireAdmin();
  const values = formValues(formData);

  const type = text(formData, "type");
  const description = text(formData, "description");
  const amountRaw = text(formData, "amount");
  const date = text(formData, "date");

  const errors: Record<string, string> = {};
  if (!isTransactionType(type)) errors.type = "Kies inkomst of uitgave.";
  if (!description) errors.description = "Vul een omschrijving in.";
  else if (description.length > 255) errors.description = "De omschrijving mag maximaal 255 tekens lang zijn.";
  const amountCents = parseEuroToCents(amountRaw);
  if (!amountRaw) errors.amount = "Vul een bedrag in.";
  else if (amountCents === null) errors.amount = "Vul een geldig bedrag in, bijvoorbeeld 12,50.";
  else if (amountCents <= 0) errors.amount = "Het bedrag moet groter zijn dan € 0.";
  else if (amountCents > MAX_CENTS) errors.amount = "Het bedrag is te groot.";
  if (!date) errors.date = "Vul een datum in.";
  else if (!isValidDate(date)) errors.date = "Vul een geldige datum in.";

  if (Object.keys(errors).length > 0) {
    return { errors, values, message: "Controleer de gemarkeerde velden." };
  }

  const db = getDatabase();
  const existing = id === null ? null : await db.transactions.findById(id);
  if (id !== null && !existing) return { values, message: "Deze registratie bestaat niet meer." };

  const input: FinancialTransactionInput = {
    type: type as TransactionType,
    amountCents: amountCents!,
    date,
    description,
    source: existing?.source ?? "handmatig",
    externalId: existing?.externalId ?? null,
    createdBy: existing?.createdBy ?? admin.id,
  };

  try {
    if (id === null) await db.transactions.create(input);
    else await db.transactions.update(id, input);
  } catch (error) {
    console.error("Opslaan van registratie mislukt", error);
    return { values, message: "Opslaan is mislukt. Probeer het opnieuw." };
  }

  revalidateFinance();
  redirect(`${TRANSACTION_TYPES[input.type].path}?melding=${id === null ? "toegevoegd" : "opgeslagen"}`);
}

export async function deleteTransaction(id: number): Promise<void> {
  await requireAdmin();
  const db = getDatabase();
  const transaction = await db.transactions.findById(id);
  if (transaction) await db.transactions.delete(id);
  revalidateFinance();
  redirect(`${TRANSACTION_TYPES[transaction?.type ?? "inkomst"].path}?melding=verwijderd`);
}
