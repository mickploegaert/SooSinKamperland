import type { Metadata } from "next";
import { PageTitle } from "@/components/page-title";

export const metadata: Metadata = { title: "Zalen" };

export default function ZalenPage() {
  return <PageTitle title="Zalen" />;
}
