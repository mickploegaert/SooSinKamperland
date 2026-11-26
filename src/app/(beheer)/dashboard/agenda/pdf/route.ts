import { requireAdmin } from "@/lib/auth/dal";
import { buildAgendaPdf } from "@/lib/agenda-pdf";
import { getDatabase } from "@/lib/data";
import { todayIso } from "@/lib/format";

/** Downloadt de geplande afspraken (vandaag en later) als PDF. Alleen voor beheerders. */
export async function GET() {
  await requireAdmin();
  const today = todayIso();
  const appointments = await getDatabase().appointments.listUpcoming(today);
  const pdf = buildAgendaPdf(appointments, today);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="agenda-soos-${today}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
