import type { Metadata } from "next";
import { PageTitle } from "@/components/page-title";

export const metadata: Metadata = { title: "Sponsoren" };

export default function SponsorenPage() {
  return <PageTitle title="Sponsoren" />;
}
