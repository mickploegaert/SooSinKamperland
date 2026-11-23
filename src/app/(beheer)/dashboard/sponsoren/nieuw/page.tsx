import type { Metadata } from "next";
import { BackLink, DashboardHeading } from "@/components/dashboard/ui";
import { requireAdmin } from "@/lib/auth/dal";
import { saveSponsor } from "../actions";
import { SponsorForm } from "../sponsor-form";

export const metadata: Metadata = { title: "Sponsor toevoegen" };

export default async function NewSponsorPage() {
  await requireAdmin();
  return (
    <section>
      <BackLink href="/dashboard/sponsoren" label="Sponsoren" />
      <div className="mt-3">
        <DashboardHeading title="Sponsor toevoegen" />
      </div>
      <SponsorForm action={saveSponsor.bind(null, null)} />
    </section>
  );
}
