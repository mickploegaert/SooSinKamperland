import { upcomingActivities } from "@/lib/activities";
import { contactInfo } from "@/lib/contact-info";
import { buildIcs } from "@/lib/ics";

export async function GET() {
  const location = `Soos in Kamperland, ${contactInfo.street}, ${contactInfo.postalCode} ${contactInfo.city}`;
  const body = buildIcs(upcomingActivities(), location);

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="soos-in-kamperland-agenda.ics"',
      "Cache-Control": "no-store",
    },
  });
}
