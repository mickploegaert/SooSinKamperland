import type { Metadata } from "next";
import { BackLink, DashboardHeading } from "@/components/dashboard/ui";
import { requireAdmin } from "@/lib/auth/dal";
import { saveActivity } from "../actions";
import { ActivityForm } from "../activity-form";

export const metadata: Metadata = { title: "Activiteit toevoegen" };

export default async function NewActivityPage() {
  await requireAdmin();
  return (
    <section>
      <BackLink href="/dashboard/activiteiten" label="Activiteiten" />
      <div className="mt-3">
        <DashboardHeading title="Activiteit toevoegen" />
      </div>
      <ActivityForm action={saveActivity.bind(null, null)} />
    </section>
  );
}
