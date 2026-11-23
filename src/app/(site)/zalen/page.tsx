import type { Metadata } from "next";
import { ContentSections } from "@/components/content-sections";
import { PageTitle } from "@/components/page-title";
import { getPageContent } from "@/lib/public-content";

export const metadata: Metadata = { title: "Zalen" };

export default async function ZalenPage() {
  const items = await getPageContent("zalen");

  return (
    <>
      <PageTitle title="Zalen" />
      <ContentSections items={items} />
    </>
  );
}
