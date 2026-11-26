import "server-only";
import { getDatabase } from "@/lib/data";
import type { Sponsor } from "@/lib/data/types";

/** Sponsoren en vrienden van de soos uit de database, in de volgorde van het dashboard. */
export async function loadSponsors(): Promise<{ sponsors: Sponsor[]; friends: Sponsor[] }> {
  const all = (await getDatabase().sponsors.list()).sort((a, b) => a.sortOrder - b.sortOrder);
  return {
    sponsors: all.filter((sponsor) => !sponsor.isFriend),
    friends: all.filter((sponsor) => sponsor.isFriend),
  };
}
