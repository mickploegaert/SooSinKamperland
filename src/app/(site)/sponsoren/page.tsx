import type { Metadata } from "next";
import { ContentSections } from "@/components/content-sections";
import { PageTitle } from "@/components/page-title";
import { getPageContent } from "@/lib/public-content";

export const metadata: Metadata = { title: "Sponsoren" };

export default async function SponsorenPage() {
  const items = await getPageContent("sponsoren");

  return (
    <>
      <PageTitle title="Sponsoren" />
      <ContentSections items={items} />
    </>
  );
}
