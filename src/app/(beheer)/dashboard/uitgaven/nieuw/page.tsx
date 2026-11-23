import type { Metadata } from "next";
import { NewTransactionPage } from "@/components/finance/transaction-pages";

export const metadata: Metadata = { title: "Uitgave registreren" };

export default function Page() {
  return <NewTransactionPage type="uitgave" />;
}
