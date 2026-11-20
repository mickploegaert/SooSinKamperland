import type { Metadata } from "next";
import { PageTitle } from "@/components/page-title";

export const metadata: Metadata = { title: "Agenda" };

export default function AgendaPage() {
  return <PageTitle title="Agenda" />;
}
