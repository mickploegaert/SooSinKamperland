export type Sponsor = {
  name: string;
  logo: string;
  /** Korte beschrijving, bijvoorbeeld de slogan uit het logo. */
  description?: string;
  /** Website of externe link. Zonder link wordt er geen knop getoond. */
  website?: string;
};

export type FriendTier = {
  name: string;
  price: number;
  tone: "gold" | "silver" | "bronze";
};

export const sponsors: Sponsor[] = [
  {
    name: "AH & Etos Kamperland",
    logo: "/sponsoren/ah-etos-kamperland.png",
    description: "Supermarkt en drogist in Kamperland.",
  },
  {
    name: "Installatiebedrijf Zuid",
    logo: "/sponsoren/installatiebedrijf-zuid.jpeg",
    description: "Installatiebedrijf IBZ b.v.",
  },
  {
    name: "Suukeruusje",
    logo: "/sponsoren/suukeruusje.png",
    description: "Toarte om van te (tr)ouwe.",
  },
  {
    name: "Schildersbedrijf Jongejan",
    logo: "/sponsoren/schildersbedrijf-jongejan.png",
    description: "Schildersbedrijf.",
  },
  {
    name: "Eriks Optiek",
    logo: "/sponsoren/eriks-optiek.png",
    description: "Brillen en lenzen.",
  },
  {
    name: "De Visserie",
    logo: "/sponsoren/de-visserie.jpeg",
    description: "Verse vis.",
  },
  {
    name: "T.A. Makelaardij",
    logo: "/sponsoren/ta-makelaardij.jpeg",
    description: "Makelaardij.",
  },
  {
    name: "Novelty",
    logo: "/sponsoren/novelty.png",
    description: "Schoonheidssalon Kamperland.",
  },
  {
    name: "Zilt Beauty",
    logo: "/sponsoren/zilt-beauty.png",
    description: "Beauty | Kamperland.",
  },
  {
    name: "Meulenberg Woon-ID",
    logo: "/sponsoren/meulenberg-woon-id.jpg",
    description: "Vloeren, raamdecoratie en woonaccessoires.",
  },
  {
    name: "Tino van Leeuwen",
    logo: "/sponsoren/tino-van-leeuwen.jpeg",
    description: "Complete woningstoffering.",
  },
  {
    name: "Jacare",
    logo: "/sponsoren/jacare.png",
    description: "We care for you.",
  },
  {
    name: "Bouwcenter De Haze",
    logo: "/sponsoren/bouwcenter-de-haze.jpg",
    description: "Bouwmaterialen en doe-het-zelf.",
  },
  {
    name: "De Fietsloods",
    logo: "/sponsoren/de-fietsloods.png",
    description: "Fietsen.",
  },
  {
    name: "Kwalitaria",
    logo: "/sponsoren/kwalitaria.jpg",
    description: "Natuurlijk de lekkerste.",
  },
];

export const friendTiers: FriendTier[] = [
  { name: "Gouden rank", price: 75, tone: "gold" },
  { name: "Zilveren rank", price: 50, tone: "silver" },
  { name: "Bronzen rank", price: 35, tone: "bronze" },
];
