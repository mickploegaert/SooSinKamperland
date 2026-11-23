import type { Metadata } from "next";
import { EditTransactionPage } from "@/components/finance/transaction-pages";

export const metadata: Metadata = { title: "Uitgave bewerken" };

export default async function Page({ params }: PageProps<"/dashboard/uitgaven/[id]">) {
  return <EditTransactionPage type="uitgave" rawId={(await params).id} />;
}
