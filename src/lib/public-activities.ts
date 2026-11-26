import "server-only";
import { toPublicActivities } from "@/lib/activities";
import { getDatabase } from "@/lib/data";
import { todayIso } from "@/lib/format";

/** Komende, zichtbare activiteiten voor de publieke pagina's, uit de database. */
export async function upcomingActivities() {
  return toPublicActivities(await getDatabase().activities.list(), todayIso());
}
