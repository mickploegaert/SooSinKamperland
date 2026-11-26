import type { Metadata } from "next";
import { BackLink, DashboardHeading } from "@/components/dashboard/ui";
import { requireAdmin } from "@/lib/auth/dal";
import { isValidDate } from "@/lib/forms";
import { saveAppointment } from "../actions";
import { AppointmentForm } from "../appointment-form";

export const metadata: Metadata = { title: "Afspraak toevoegen" };

export default async function NewAppointmentPage({ searchParams }: PageProps<"/dashboard/agenda/nieuw">) {
  await requireAdmin();
  const { datum } = await searchParams;
  // Vanuit het kalenderraster komt de gekozen dag (of 1e van de maand) mee.
  const defaultDate = typeof datum === "string" && isValidDate(datum) ? datum : undefined;

  return (
    <section>
      <BackLink href="/dashboard/agenda" label="Agenda" />
      <div className="mt-3">
        <DashboardHeading title="Afspraak toevoegen" />
      </div>
      <AppointmentForm action={saveAppointment.bind(null, null)} defaultDate={defaultDate} />
    </section>
  );
}
