import type { Metadata } from "next";
import { NewTransactionPage } from "@/components/finance/transaction-pages";

export const metadata: Metadata = { title: "Inkomst registreren" };

export default function Page() {
  return <NewTransactionPage type="inkomst" />;
}
