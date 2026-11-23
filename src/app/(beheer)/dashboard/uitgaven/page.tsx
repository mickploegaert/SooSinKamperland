import type { Metadata } from "next";
import { TransactionListPage } from "@/components/finance/transaction-pages";

export const metadata: Metadata = { title: "Uitgaven" };

export default async function Page({ searchParams }: PageProps<"/dashboard/uitgaven">) {
  return <TransactionListPage type="uitgave" notice={(await searchParams).melding} />;
}
