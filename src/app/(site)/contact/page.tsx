import type { Metadata } from "next";
import { ContentSections } from "@/components/content-sections";
import { PageTitle } from "@/components/page-title";
import { getPageContent } from "@/lib/public-content";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const items = await getPageContent("contact");

  return (
    <>
      <PageTitle title="Contact" />
      <ContentSections items={items} />
    </>
  );
}
