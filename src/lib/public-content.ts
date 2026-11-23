import "server-only";
import { connection } from "next/server";
import { getDatabase } from "@/lib/data";
import { HERO_SECTION, type WebsiteContent, type WebsitePage } from "@/lib/data/types";

/**
 * Haalt de inhoud van een publieke pagina op bij ieder verzoek, zodat
 * wijzigingen uit het dashboard direct zichtbaar zijn.
 */
export async function getPageContent(page: WebsitePage): Promise<WebsiteContent[]> {
  await connection();
  try {
    return await getDatabase().websiteContent.listByPage(page);
  } catch (error) {
    // De pagina moet blijven werken als de opslag even niet bereikbaar is.
    console.error(`Website-inhoud voor "${page}" kon niet worden geladen`, error);
    return [];
  }
}

export function splitHero(items: WebsiteContent[]) {
  return {
    hero: items.find((item) => item.section === HERO_SECTION) ?? null,
    sections: items.filter((item) => item.section !== HERO_SECTION),
  };
}
