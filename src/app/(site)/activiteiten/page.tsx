import type { Metadata } from "next";
import { PageTitle } from "@/components/page-title";

export const metadata: Metadata = { title: "Activiteiten" };

export default function ActiviteitenPage() {
  return <PageTitle title="Activiteiten" />;
}
