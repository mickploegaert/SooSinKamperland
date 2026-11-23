import type { Metadata } from "next";
import { PageTitle } from "@/components/page-title";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return <PageTitle title="Contact" />;
}
