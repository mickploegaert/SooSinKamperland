import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { BackLink, DashboardHeading } from "@/components/dashboard/ui";
import { requireAdmin } from "@/lib/auth/dal";
import { getDatabase } from "@/lib/data";
import { parseId } from "@/lib/forms";
import { deleteWebsiteContent, saveWebsiteContent } from "../actions";
import { ContentForm } from "../content-form";

export const metadata: Metadata = { title: "Website-informatie bewerken" };

export default async function EditWebsiteContentPage({ params }: PageProps<"/dashboard/website/[id]">) {
  await requireAdmin();
  const id = parseId((await params).id);
  const item = id ? await getDatabase().websiteContent.findById(id) : null;
  if (!item) notFound();

  return (
    <section>
      <BackLink href="/dashboard/website" label="Website-informatie" />
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <DashboardHeading title="Informatie bewerken" description={item.title} />
        <DeleteButton
          action={deleteWebsiteContent.bind(null, item.id)}
          confirmText={`Weet je zeker dat je "${item.title}" wilt verwijderen?`}
        />
      </div>
      <ContentForm action={saveWebsiteContent.bind(null, item.id)} item={item} />
    </section>
  );
}
