import type { Metadata } from "next";
import { EditTransactionPage } from "@/components/finance/transaction-pages";

export const metadata: Metadata = { title: "Inkomst bewerken" };

export default async function Page({ params }: PageProps<"/dashboard/inkomsten/[id]">) {
  return <EditTransactionPage type="inkomst" rawId={(await params).id} />;
}
