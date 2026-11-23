import { activitySlug, upcomingActivities } from "@/lib/activities";
import { contactInfo } from "@/lib/contact-info";
import { buildIcs } from "@/lib/ics";

export async function GET(request: Request) {
  const location = `Soos in Kamperland, ${contactInfo.street}, ${contactInfo.postalCode} ${contactInfo.city}`;
  const slug = new URL(request.url).searchParams.get("activiteit");
  const all = upcomingActivities();
  const items = slug ? all.filter((item) => activitySlug(item) === slug) : all;
  if (slug && items.length === 0) {
    return new Response("Activiteit niet gevonden.", { status: 404 });
  }
  const body = buildIcs(items, location);
  const filename = slug ? `${slug}.ics` : "soos-in-kamperland-agenda.ics";

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
