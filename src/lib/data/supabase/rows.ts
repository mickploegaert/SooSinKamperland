import "server-only";
import type { PostgrestError } from "@supabase/supabase-js";
import type {
  Activity,
  ActivityInput,
  Admin,
  Appointment,
  AppointmentInput,
  FinancialTransaction,
  FinancialTransactionInput,
  Sponsor,
  SponsorInput,
  SumUpTransaction,
  SumUpTransactionInput,
  WebsiteContent,
  WebsiteContentInput,
} from "../types";

/**
 * Omzetting tussen de rijen in Supabase (Nederlandse kolomnamen uit het PDM)
 * en de typen die de rest van de code gebruikt (src/lib/data/types.ts).
 */

/** Gooit een fout als Supabase er een teruggeeft, zodat pagina's hun foutmelding tonen. */
export async function run<T>(
  query: PromiseLike<{ data: T | null; error: PostgrestError | null }>,
): Promise<T | null> {
  const { data, error } = await query;
  if (error) throw new Error(`Supabase: ${error.message} (${error.code})`);
  return data;
}

/** "20:00:00" (Postgres time) → "20:00" */
const toTime = (value: string | null) => (value ? value.slice(0, 5) : null);
/** 12.5 of "12.50" (Postgres decimal) → 1250 */
const toCents = (value: number | string) => Math.round(Number(value) * 100);
/** 1250 → "12.50" (exact, zonder afrondingsfouten van kommagetallen) */
const fromCents = (cents: number) => (cents / 100).toFixed(2);
/** beheerder_id kan null zijn als een beheerder is verwijderd. */
const adminId = (value: number | null) => value ?? 0;
/** 0 betekent "onbekend" en mag niet als foreign key worden opgeslagen. */
const adminRef = (id: number) => (id > 0 ? id : null);

// ─── beheerder ───────────────────────────────────────────────────────────────
export type BeheerderRow = {
  beheerder_id: number;
  gebruikersnaam: string;
  email: string;
  aangemaakt_op: string;
};

export const toAdmin = (row: BeheerderRow): Admin => ({
  id: row.beheerder_id,
  username: row.gebruikersnaam,
  email: row.email,
  // Supabase Auth beheert het wachtwoord; de hash is hier nooit beschikbaar.
  passwordHash: "",
  createdAt: row.aangemaakt_op,
});

// ─── website_inhoud ──────────────────────────────────────────────────────────
export type WebsiteInhoudRow = {
  inhoud_id: number;
  paginanaam: string;
  sectie: string;
  titel: string;
  inhoudstekst: string;
  afbeelding_url: string | null;
  laatste_wijziging: string;
  beheerder_id: number | null;
};

export const toWebsiteContent = (row: WebsiteInhoudRow): WebsiteContent => ({
  id: row.inhoud_id,
  page: row.paginanaam as WebsiteContent["page"],
  section: row.sectie,
  title: row.titel,
  body: row.inhoudstekst,
  imageUrl: row.afbeelding_url,
  updatedAt: row.laatste_wijziging,
  updatedBy: adminId(row.beheerder_id),
});

export const fromWebsiteContent = (input: WebsiteContentInput) => ({
  paginanaam: input.page,
  sectie: input.section,
  titel: input.title,
  inhoudstekst: input.body,
  afbeelding_url: input.imageUrl,
  laatste_wijziging: new Date().toISOString(),
  beheerder_id: adminRef(input.updatedBy),
});

// ─── activiteit ──────────────────────────────────────────────────────────────
export type ActiviteitRow = {
  activiteit_id: number;
  naam: string;
  beschrijving: string;
  categorie: string | null;
  startdatum: string;
  einddatum: string | null;
  starttijd: string | null;
  eindtijd: string | null;
  locatie: string | null;
  herhaling: "week" | "month" | null;
  herhaling_tot: string | null;
  afbeelding_url: string | null;
  is_zichtbaar: boolean;
  beheerder_id: number | null;
};

export const toActivity = (row: ActiviteitRow): Activity => ({
  id: row.activiteit_id,
  name: row.naam,
  description: row.beschrijving,
  category: row.categorie,
  startDate: row.startdatum,
  endDate: row.einddatum,
  startTime: toTime(row.starttijd),
  endTime: toTime(row.eindtijd),
  location: row.locatie,
  repeatEvery: row.herhaling,
  repeatUntil: row.herhaling_tot,
  imageUrl: row.afbeelding_url,
  isVisible: row.is_zichtbaar,
  updatedBy: adminId(row.beheerder_id),
});

export const fromActivity = (input: ActivityInput) => ({
  naam: input.name,
  beschrijving: input.description,
  categorie: input.category,
  startdatum: input.startDate,
  einddatum: input.endDate,
  starttijd: input.startTime,
  eindtijd: input.endTime,
  locatie: input.location,
  herhaling: input.repeatEvery,
  herhaling_tot: input.repeatUntil,
  afbeelding_url: input.imageUrl,
  is_zichtbaar: input.isVisible,
  beheerder_id: adminRef(input.updatedBy),
});

// ─── afspraak ────────────────────────────────────────────────────────────────
export type AfspraakRow = {
  afspraak_id: number;
  titel: string;
  datum: string;
  starttijd: string;
  eindtijd: string | null;
  locatie: string | null;
  notities: string | null;
  beheerder_id: number | null;
};

export const toAppointment = (row: AfspraakRow): Appointment => ({
  id: row.afspraak_id,
  title: row.titel,
  date: row.datum,
  startTime: toTime(row.starttijd) ?? "00:00",
  endTime: toTime(row.eindtijd),
  location: row.locatie,
  notes: row.notities,
  updatedBy: adminId(row.beheerder_id),
});

export const fromAppointment = (input: AppointmentInput) => ({
  titel: input.title,
  datum: input.date,
  starttijd: input.startTime,
  eindtijd: input.endTime,
  locatie: input.location,
  notities: input.notes,
  beheerder_id: adminRef(input.updatedBy),
});

// ─── sponsor ─────────────────────────────────────────────────────────────────
export type SponsorRow = {
  sponsor_id: number;
  naam: string;
  beschrijving: string | null;
  logo_url: string | null;
  website_url: string | null;
  niveau: Sponsor["level"];
  is_vriend_van_de_soos: boolean;
  weergave_volgorde: number;
  beheerder_id: number | null;
};

export const toSponsor = (row: SponsorRow): Sponsor => ({
  id: row.sponsor_id,
  name: row.naam,
  description: row.beschrijving,
  logoUrl: row.logo_url,
  websiteUrl: row.website_url,
  level: row.niveau,
  isFriend: row.is_vriend_van_de_soos,
  sortOrder: row.weergave_volgorde,
  updatedBy: adminId(row.beheerder_id),
});

export const fromSponsor = (input: SponsorInput) => ({
  naam: input.name,
  beschrijving: input.description,
  logo_url: input.logoUrl,
  website_url: input.websiteUrl,
  niveau: input.level,
  is_vriend_van_de_soos: input.isFriend,
  weergave_volgorde: input.sortOrder,
  beheerder_id: adminRef(input.updatedBy),
});

// ─── financiele_transactie ───────────────────────────────────────────────────
export type FinancieleTransactieRow = {
  transactie_id: number;
  transactietype: FinancialTransaction["type"];
  bedrag: number | string;
  datum: string;
  omschrijving: string;
  bron: FinancialTransaction["source"];
  externe_transactie_id: string | null;
  beheerder_id: number | null;
};

export const toTransaction = (row: FinancieleTransactieRow): FinancialTransaction => ({
  id: row.transactie_id,
  type: row.transactietype,
  amountCents: toCents(row.bedrag),
  date: row.datum,
  description: row.omschrijving,
  source: row.bron,
  externalId: row.externe_transactie_id,
  createdBy: adminId(row.beheerder_id),
});

export const fromTransaction = (input: FinancialTransactionInput) => ({
  transactietype: input.type,
  bedrag: fromCents(input.amountCents),
  datum: input.date,
  omschrijving: input.description,
  bron: input.source,
  externe_transactie_id: input.externalId,
  beheerder_id: adminRef(input.createdBy),
});

// ─── sumup_transactie ────────────────────────────────────────────────────────
export type SumUpTransactieRow = {
  sumup_transactie_id: number;
  externe_transactie_id: string;
  transactiecode: string | null;
  bedrag: number | string;
  valuta: string;
  transactiedatum: string;
  status: string;
  betaalwijze: string | null;
  kaarttype: string | null;
  omschrijving: string | null;
  laatst_gesynchroniseerd: string;
};

export const toSumUpTransaction = (row: SumUpTransactieRow): SumUpTransaction => ({
  id: row.sumup_transactie_id,
  externalId: row.externe_transactie_id,
  transactionCode: row.transactiecode,
  amountCents: toCents(row.bedrag),
  currency: row.valuta,
  timestamp: new Date(row.transactiedatum).toISOString(),
  status: row.status,
  paymentType: row.betaalwijze,
  cardType: row.kaarttype,
  description: row.omschrijving,
  syncedAt: row.laatst_gesynchroniseerd,
});

export const fromSumUpTransaction = (input: SumUpTransactionInput, syncedAt: string) => ({
  externe_transactie_id: input.externalId,
  transactiecode: input.transactionCode,
  bedrag: fromCents(input.amountCents),
  valuta: input.currency,
  transactiedatum: input.timestamp,
  status: input.status,
  betaalwijze: input.paymentType,
  kaarttype: input.cardType,
  omschrijving: input.description,
  laatst_gesynchroniseerd: syncedAt,
});
