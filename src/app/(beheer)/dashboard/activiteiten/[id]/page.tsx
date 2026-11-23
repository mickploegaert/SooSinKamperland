import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { BackLink, DashboardHeading } from "@/components/dashboard/ui";
import { requireAdmin } from "@/lib/auth/dal";
import { getDatabase } from "@/lib/data";
import { parseId } from "@/lib/forms";
import { deleteActivity, saveActivity } from "../actions";
import { ActivityForm } from "../activity-form";

export const metadata: Metadata = { title: "Activiteit bewerken" };

export default async function EditActivityPage({ params }: PageProps<"/dashboard/activiteiten/[id]">) {
  await requireAdmin();
  const id = parseId((await params).id);
  const activity = id ? await getDatabase().activities.findById(id) : null;
  if (!activity) notFound();

  return (
    <section>
      <BackLink href="/dashboard/activiteiten" label="Activiteiten" />
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <DashboardHeading title="Activiteit bewerken" description={activity.name} />
        <DeleteButton
          action={deleteActivity.bind(null, activity.id)}
          confirmText={`Weet je zeker dat je "${activity.name}" wilt verwijderen?`}
        />
      </div>
      <ActivityForm action={saveActivity.bind(null, activity.id)} activity={activity} />
    </section>
  );
}
