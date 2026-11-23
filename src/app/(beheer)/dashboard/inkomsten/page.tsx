import type { Metadata } from "next";
import { TransactionListPage } from "@/components/finance/transaction-pages";

export const metadata: Metadata = { title: "Inkomsten" };

export default async function Page({ searchParams }: PageProps<"/dashboard/inkomsten">) {
  return <TransactionListPage type="inkomst" notice={(await searchParams).melding} />;
}
