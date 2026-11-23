import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { BackLink, DashboardHeading } from "@/components/dashboard/ui";
import { requireAdmin } from "@/lib/auth/dal";
import { getDatabase } from "@/lib/data";
import { parseId } from "@/lib/forms";
import { deleteSponsor, saveSponsor } from "../actions";
import { SponsorForm } from "../sponsor-form";

export const metadata: Metadata = { title: "Sponsor bewerken" };

export default async function EditSponsorPage({ params }: PageProps<"/dashboard/sponsoren/[id]">) {
  await requireAdmin();
  const id = parseId((await params).id);
  const sponsor = id ? await getDatabase().sponsors.findById(id) : null;
  if (!sponsor) notFound();

  return (
    <section>
      <BackLink href="/dashboard/sponsoren" label="Sponsoren" />
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <DashboardHeading title="Sponsor bewerken" description={sponsor.name} />
        <DeleteButton
          action={deleteSponsor.bind(null, sponsor.id)}
          confirmText={`Weet je zeker dat je "${sponsor.name}" wilt verwijderen?`}
        />
      </div>
      <SponsorForm action={saveSponsor.bind(null, sponsor.id)} sponsor={sponsor} />
    </section>
  );
}
