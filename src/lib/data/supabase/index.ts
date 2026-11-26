import "server-only";
import { createSecretClient, createSessionClient } from "@/lib/supabase/server";
import type {
  ActivityRepository,
  AdminRepository,
  AppointmentRepository,
  Database,
  FinancialTransactionRepository,
  SponsorRepository,
  SumUpTransactionRepository,
  WebsiteContentRepository,
} from "../repositories";
import { sponsorOrder } from "../sponsor-order";
import {
  type ActiviteitRow,
  type AfspraakRow,
  type BeheerderRow,
  type FinancieleTransactieRow,
  type SponsorRow,
  type SumUpTransactieRow,
  type WebsiteInhoudRow,
  fromActivity,
  fromAppointment,
  fromSponsor,
  fromSumUpTransaction,
  fromTransaction,
  fromWebsiteContent,
  run,
  toActivity,
  toAdmin,
  toAppointment,
  toSponsor,
  toSumUpTransaction,
  toTransaction,
  toWebsiteContent,
} from "./rows";

/**
 * Supabase-implementatie van het `Database`-contract.
 *
 * Iedere aanroep gebruikt de sessie van het huidige verzoek, zodat Row Level
 * Security bepaalt wat mag: bezoekers lezen alleen openbare gegevens, ingelogde
 * beheerders mogen alles. De rechten-controle in de app (`requireAdmin`) blijft
 * daarnaast gewoon bestaan.
 */

const BEHEERDER_COLUMNS = "beheerder_id, gebruikersnaam, email, aangemaakt_op";

const admins: AdminRepository = {
  async findById(id) {
    const db = await createSessionClient();
    const row = await run(
      db.from("beheerder").select(BEHEERDER_COLUMNS).eq("beheerder_id", id).maybeSingle<BeheerderRow>(),
    );
    return row ? toAdmin(row) : null;
  },
  async findByIdentifier(identifier) {
    const needle = identifier.trim().toLowerCase();
    if (!needle) return null;
    // Wordt gebruikt vóór het inloggen, dus zonder sessie: daarom de secret key.
    const db = createSecretClient();
    const column = needle.includes("@") ? "email" : "gebruikersnaam";
    const row = await run(
      db.from("beheerder").select(BEHEERDER_COLUMNS).ilike(column, escapeLike(needle)).maybeSingle<BeheerderRow>(),
    );
    return row ? toAdmin(row) : null;
  },
};

/** Zorgt dat % en _ in een gebruikersnaam letterlijk worden gezocht. */
function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

const websiteContent: WebsiteContentRepository = {
  async list() {
    const db = await createSessionClient();
    const rows = await run(
      db.from("website_inhoud").select("*").order("paginanaam").order("inhoud_id").returns<WebsiteInhoudRow[]>(),
    );
    return (rows ?? []).map(toWebsiteContent);
  },
  async listByPage(page) {
    const db = await createSessionClient();
    const rows = await run(
      db.from("website_inhoud").select("*").eq("paginanaam", page).order("inhoud_id").returns<WebsiteInhoudRow[]>(),
    );
    return (rows ?? []).map(toWebsiteContent);
  },
  async findBySection(page, section) {
    const db = await createSessionClient();
    const row = await run(
      db.from("website_inhoud").select("*").eq("paginanaam", page).eq("sectie", section).maybeSingle<WebsiteInhoudRow>(),
    );
    return row ? toWebsiteContent(row) : null;
  },
  async findById(id) {
    const db = await createSessionClient();
    const row = await run(db.from("website_inhoud").select("*").eq("inhoud_id", id).maybeSingle<WebsiteInhoudRow>());
    return row ? toWebsiteContent(row) : null;
  },
  async create(input) {
    const db = await createSessionClient();
    const row = await run(
      db.from("website_inhoud").insert(fromWebsiteContent(input)).select().single<WebsiteInhoudRow>(),
    );
    return toWebsiteContent(row!);
  },
  async update(id, input) {
    const db = await createSessionClient();
    const row = await run(
      db.from("website_inhoud").update(fromWebsiteContent(input)).eq("inhoud_id", id).select().maybeSingle<WebsiteInhoudRow>(),
    );
    return row ? toWebsiteContent(row) : null;
  },
  async delete(id) {
    const db = await createSessionClient();
    const rows = await run(db.from("website_inhoud").delete().eq("inhoud_id", id).select("inhoud_id"));
    return (rows ?? []).length > 0;
  },
};

const activities: ActivityRepository = {
  async list() {
    const db = await createSessionClient();
    const rows = await run(
      db
        .from("activiteit")
        .select("*")
        .order("startdatum")
        .order("starttijd", { nullsFirst: true })
        .returns<ActiviteitRow[]>(),
    );
    return (rows ?? []).map(toActivity);
  },
  async listUpcoming(today) {
    const db = await createSessionClient();
    const rows = await run(
      db
        .from("activiteit")
        .select("*")
        .eq("is_zichtbaar", true)
        // Nog niet voorbij: de einddatum (of anders de startdatum) is vandaag of later.
        .or(`einddatum.gte.${today},and(einddatum.is.null,startdatum.gte.${today})`)
        .order("startdatum")
        .order("starttijd", { nullsFirst: true })
        .returns<ActiviteitRow[]>(),
    );
    return (rows ?? []).map(toActivity);
  },
  async findById(id) {
    const db = await createSessionClient();
    const row = await run(db.from("activiteit").select("*").eq("activiteit_id", id).maybeSingle<ActiviteitRow>());
    return row ? toActivity(row) : null;
  },
  async create(input) {
    const db = await createSessionClient();
    const row = await run(db.from("activiteit").insert(fromActivity(input)).select().single<ActiviteitRow>());
    return toActivity(row!);
  },
  async update(id, input) {
    const db = await createSessionClient();
    const row = await run(
      db.from("activiteit").update(fromActivity(input)).eq("activiteit_id", id).select().maybeSingle<ActiviteitRow>(),
    );
    return row ? toActivity(row) : null;
  },
  async delete(id) {
    const db = await createSessionClient();
    const rows = await run(db.from("activiteit").delete().eq("activiteit_id", id).select("activiteit_id"));
    return (rows ?? []).length > 0;
  },
};

const appointments: AppointmentRepository = {
  async list() {
    const db = await createSessionClient();
    const rows = await run(
      db.from("afspraak").select("*").order("datum").order("starttijd").returns<AfspraakRow[]>(),
    );
    return (rows ?? []).map(toAppointment);
  },
  async listUpcoming(today) {
    const db = await createSessionClient();
    const rows = await run(
      db.from("afspraak").select("*").gte("datum", today).order("datum").order("starttijd").returns<AfspraakRow[]>(),
    );
    return (rows ?? []).map(toAppointment);
  },
  async findById(id) {
    const db = await createSessionClient();
    const row = await run(db.from("afspraak").select("*").eq("afspraak_id", id).maybeSingle<AfspraakRow>());
    return row ? toAppointment(row) : null;
  },
  async create(input) {
    const db = await createSessionClient();
    const row = await run(db.from("afspraak").insert(fromAppointment(input)).select().single<AfspraakRow>());
    return toAppointment(row!);
  },
  async update(id, input) {
    const db = await createSessionClient();
    const row = await run(
      db.from("afspraak").update(fromAppointment(input)).eq("afspraak_id", id).select().maybeSingle<AfspraakRow>(),
    );
    return row ? toAppointment(row) : null;
  },
  async delete(id) {
    const db = await createSessionClient();
    const rows = await run(db.from("afspraak").delete().eq("afspraak_id", id).select("afspraak_id"));
    return (rows ?? []).length > 0;
  },
};

const sponsors: SponsorRepository = {
  async list() {
    const db = await createSessionClient();
    const rows = await run(db.from("sponsor").select("*").returns<SponsorRow[]>());
    // Zelfde volgorde als de lokale opslag (niveau, volgorde, naam).
    return (rows ?? []).map(toSponsor).sort(sponsorOrder);
  },
  async findById(id) {
    const db = await createSessionClient();
    const row = await run(db.from("sponsor").select("*").eq("sponsor_id", id).maybeSingle<SponsorRow>());
    return row ? toSponsor(row) : null;
  },
  async create(input) {
    const db = await createSessionClient();
    const row = await run(db.from("sponsor").insert(fromSponsor(input)).select().single<SponsorRow>());
    return toSponsor(row!);
  },
  async update(id, input) {
    const db = await createSessionClient();
    const row = await run(
      db.from("sponsor").update(fromSponsor(input)).eq("sponsor_id", id).select().maybeSingle<SponsorRow>(),
    );
    return row ? toSponsor(row) : null;
  },
  async delete(id) {
    const db = await createSessionClient();
    const rows = await run(db.from("sponsor").delete().eq("sponsor_id", id).select("sponsor_id"));
    return (rows ?? []).length > 0;
  },
};

const transactions: FinancialTransactionRepository = {
  async list() {
    const db = await createSessionClient();
    const rows = await run(
      db
        .from("financiele_transactie")
        .select("*")
        .order("datum", { ascending: false })
        .order("transactie_id", { ascending: false })
        .returns<FinancieleTransactieRow[]>(),
    );
    return (rows ?? []).map(toTransaction);
  },
  async listByType(type) {
    const db = await createSessionClient();
    const rows = await run(
      db
        .from("financiele_transactie")
        .select("*")
        .eq("transactietype", type)
        .order("datum", { ascending: false })
        .order("transactie_id", { ascending: false })
        .returns<FinancieleTransactieRow[]>(),
    );
    return (rows ?? []).map(toTransaction);
  },
  async findById(id) {
    const db = await createSessionClient();
    const row = await run(
      db.from("financiele_transactie").select("*").eq("transactie_id", id).maybeSingle<FinancieleTransactieRow>(),
    );
    return row ? toTransaction(row) : null;
  },
  async create(input) {
    const db = await createSessionClient();
    const row = await run(
      db.from("financiele_transactie").insert(fromTransaction(input)).select().single<FinancieleTransactieRow>(),
    );
    return toTransaction(row!);
  },
  async update(id, input) {
    const db = await createSessionClient();
    const row = await run(
      db
        .from("financiele_transactie")
        .update(fromTransaction(input))
        .eq("transactie_id", id)
        .select()
        .maybeSingle<FinancieleTransactieRow>(),
    );
    return row ? toTransaction(row) : null;
  },
  async delete(id) {
    const db = await createSessionClient();
    const rows = await run(db.from("financiele_transactie").delete().eq("transactie_id", id).select("transactie_id"));
    return (rows ?? []).length > 0;
  },
};

const sumupTransactions: SumUpTransactionRepository = {
  async list() {
    const db = await createSessionClient();
    const rows = await run(
      db.from("sumup_transactie").select("*").order("transactiedatum", { ascending: false }).returns<SumUpTransactieRow[]>(),
    );
    return (rows ?? []).map(toSumUpTransaction);
  },
  async findById(id) {
    const db = await createSessionClient();
    const row = await run(
      db.from("sumup_transactie").select("*").eq("sumup_transactie_id", id).maybeSingle<SumUpTransactieRow>(),
    );
    return row ? toSumUpTransaction(row) : null;
  },
  async upsertMany(items) {
    if (items.length === 0) return { added: 0, updated: 0 };
    const db = await createSessionClient();
    const ids = items.map((item) => item.externalId);
    const existing = await run(
      db.from("sumup_transactie").select("externe_transactie_id").in("externe_transactie_id", ids),
    );
    const known = new Set((existing ?? []).map((row) => row.externe_transactie_id as string));
    const syncedAt = new Date().toISOString();
    // De unieke externe_transactie_id voorkomt dubbele transacties (US15).
    await run(
      db
        .from("sumup_transactie")
        .upsert(items.map((item) => fromSumUpTransaction(item, syncedAt)), { onConflict: "externe_transactie_id" }),
    );
    const updated = ids.filter((id) => known.has(id)).length;
    return { added: items.length - updated, updated };
  },
};

export const supabaseDatabase: Database = {
  admins,
  websiteContent,
  activities,
  appointments,
  sponsors,
  transactions,
  sumupTransactions,
};
