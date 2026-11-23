import type { Metadata } from "next";
import { ContentSections } from "@/components/content-sections";
import { PageTitle } from "@/components/page-title";
import { getPageContent } from "@/lib/public-content";

export const metadata: Metadata = { title: "Agenda" };

export default async function AgendaPage() {
  const items = await getPageContent("agenda");

  return (
    <>
      <PageTitle title="Agenda" />
      <ContentSections items={items} />
    </>
  );
}
