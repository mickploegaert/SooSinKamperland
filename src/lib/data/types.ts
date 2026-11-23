/**
 * Domeintypes. De velden volgen het PDM uit het ontwerpdocument
 * (tabelnamen en kolommen staan per type in het commentaar), zodat een
 * Supabase-adapter de rijen één-op-één kan omzetten.
 */

export type AdminRole = "hoofdbeheerder" | "beheerder";

/** Tabel `beheerder` */
export type Admin = {
  /** beheerder_id */
  id: number;
  /** gebruikersnaam (UK) */
  username: string;
  /** email (UK) */
  email: string;
  /** wachtwoord_hash — bij Supabase beheert Supabase Auth dit veld zelf. */
  passwordHash: string;
  role: AdminRole;
  /** aangemaakt_op */
  createdAt: string;
};

/** Beheerdersgegevens zonder gevoelige velden, veilig om aan componenten door te geven. */
export type AdminProfile = Omit<Admin, "passwordHash">;

/** Pagina's van de publieke website waarop inhoud getoond kan worden. */
export const WEBSITE_PAGES = [
  { value: "home", label: "Home", path: "/" },
  { value: "activiteiten", label: "Activiteiten", path: "/activiteiten" },
  { value: "sponsoren", label: "Sponsoren", path: "/sponsoren" },
  { value: "zalen", label: "Zalen", path: "/zalen" },
  { value: "agenda", label: "Agenda", path: "/agenda" },
  { value: "contact", label: "Contact", path: "/contact" },
] as const;

export type WebsitePage = (typeof WEBSITE_PAGES)[number]["value"];

/** Sectie die op de homepage de welkomsttekst bovenaan vervangt. */
export const HERO_SECTION = "welkom";

/** Tabel `website_inhoud` */
export type WebsiteContent = {
  /** inhoud_id */
  id: number;
  /** paginanaam */
  page: WebsitePage;
  /** sectie (uniek per pagina) */
  section: string;
  /** titel */
  title: string;
  /** inhoudstekst */
  body: string;
  /** afbeelding_url */
  imageUrl: string | null;
  /** laatste_wijziging */
  updatedAt: string;
  /** beheerder_id (FK) — wie de laatste wijziging deed */
  updatedBy: number;
};

export type WebsiteContentInput = Omit<WebsiteContent, "id" | "updatedAt">;

/** Tabel `activiteit` */
export type Activity = {
  /** activiteit_id */
  id: number;
  /** naam */
  name: string;
  /** beschrijving */
  description: string;
  /** categorie (voor het filter op de activiteitenpagina) */
  category: string | null;
  /** startdatum, JJJJ-MM-DD */
  startDate: string;
  /** einddatum, JJJJ-MM-DD (optioneel, voor meerdaagse activiteiten) */
  endDate: string | null;
  /** starttijd, UU:MM */
  startTime: string | null;
  /** eindtijd, UU:MM */
  endTime: string | null;
  /** locatie */
  location: string | null;
  /** afbeelding_url */
  imageUrl: string | null;
  /** is_zichtbaar */
  isVisible: boolean;
  /** beheerder_id (FK) */
  updatedBy: number;
};

export type ActivityInput = Omit<Activity, "id">;

/** Sponsorniveaus uit het schermontwerp van de sponsorenpagina. */
export const SPONSOR_LEVELS = [
  { value: "goud", label: "Goud", amount: "€1.000+" },
  { value: "zilver", label: "Zilver", amount: "€500 – €1.000" },
  { value: "brons", label: "Brons", amount: "€100 – €500" },
] as const;

export type SponsorLevel = (typeof SPONSOR_LEVELS)[number]["value"];

/** Tabel `sponsor` */
export type Sponsor = {
  /** sponsor_id */
  id: number;
  /** naam */
  name: string;
  /** beschrijving */
  description: string | null;
  /** logo_url */
  logoUrl: string | null;
  /** website_url */
  websiteUrl: string | null;
  /** niveau (categorie in het klassendiagram) */
  level: SponsorLevel | null;
  /** is_vriend_van_de_soos */
  isFriend: boolean;
  /** weergave_volgorde */
  sortOrder: number;
  /** beheerder_id (FK) */
  updatedBy: number;
};

export type SponsorInput = Omit<Sponsor, "id">;
