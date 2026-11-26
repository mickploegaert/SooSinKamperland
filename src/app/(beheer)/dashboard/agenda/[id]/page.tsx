import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { BackLink, DashboardHeading } from "@/components/dashboard/ui";
import { requireAdmin } from "@/lib/auth/dal";
import { getDatabase } from "@/lib/data";
import { parseId } from "@/lib/forms";
import { deleteAppointment, saveAppointment } from "../actions";
import { AppointmentForm } from "../appointment-form";

export const metadata: Metadata = { title: "Afspraak bewerken" };

export default async function EditAppointmentPage({ params }: PageProps<"/dashboard/agenda/[id]">) {
  await requireAdmin();
  const id = parseId((await params).id);
  const appointment = id ? await getDatabase().appointments.findById(id) : null;
  if (!appointment) notFound();

  return (
    <section>
      <BackLink href="/dashboard/agenda" label="Agenda" />
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <DashboardHeading title="Afspraak bewerken" description={appointment.title} />
        <DeleteButton
          action={deleteAppointment.bind(null, appointment.id)}
          confirmText={`Weet je zeker dat je "${appointment.title}" wilt verwijderen?`}
        />
      </div>
      <AppointmentForm action={saveAppointment.bind(null, appointment.id)} appointment={appointment} />
    </section>
  );
}
