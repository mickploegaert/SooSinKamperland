import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const pages = ["", "/activiteiten", "/agenda", "/sponsoren", "/over-ons", "/contact", "/aanmelden", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({ url: `${siteUrl}${path}` }));
}
