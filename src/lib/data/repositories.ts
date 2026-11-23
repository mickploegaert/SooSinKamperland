import type {
  Activity,
  ActivityInput,
  Admin,
  FinancialTransaction,
  FinancialTransactionInput,
  Sponsor,
  SumUpTransaction,
  SumUpTransactionInput,
  SponsorInput,
  WebsiteContent, WebsiteContentInput, WebsitePage } from "./types";

/**
 * Contracten voor de gegevensopslag. De pagina's en server actions praten
 * alleen met deze interfaces. Voor Supabase hoeft alleen een nieuwe
 * implementatie van `Database` geschreven te worden (zie docs/supabase.md).
 */

export interface AdminRepository {
  findById(id: number): Promise<Admin | null>;
  /** Zoekt op gebruikersnaam óf e-mailadres (hoofdletterongevoelig). */
  findByIdentifier(identifier: string): Promise<Admin | null>;
}

/** Standaard bewerkingen die iedere beheerbare tabel ondersteunt. */
export interface CrudRepository<T, TInput> {
  list(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(input: TInput): Promise<T>;
  update(id: number, input: TInput): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}

export interface WebsiteContentRepository
  extends CrudRepository<WebsiteContent, WebsiteContentInput> {
  listByPage(page: WebsitePage): Promise<WebsiteContent[]>;
  findBySection(page: WebsitePage, section: string): Promise<WebsiteContent | null>;
}

export interface ActivityRepository extends CrudRepository<Activity, ActivityInput> {
  /** Zichtbare activiteiten die vandaag of later plaatsvinden, oplopend op datum. */
  listUpcoming(today: string): Promise<Activity[]>;
}

export type SponsorRepository = CrudRepository<Sponsor, SponsorInput>;

export interface FinancialTransactionRepository
  extends CrudRepository<FinancialTransaction, FinancialTransactionInput> {
  /** Nieuwste eerst. */
  listByType(type: FinancialTransaction["type"]): Promise<FinancialTransaction[]>;
}

export interface SumUpTransactionRepository {
  /** Nieuwste eerst. */
  list(): Promise<SumUpTransaction[]>;
  findById(id: number): Promise<SumUpTransaction | null>;
  /**
   * Slaat opgehaalde transacties op. Bestaande transacties (zelfde externalId)
   * worden bijgewerkt in plaats van dubbel toegevoegd.
   */
  upsertMany(items: SumUpTransactionInput[]): Promise<{ added: number; updated: number }>;
}

export interface Database {
  admins: AdminRepository;
  websiteContent: WebsiteContentRepository;
  activities: ActivityRepository;
  sponsors: SponsorRepository;
  transactions: FinancialTransactionRepository;
  sumupTransactions: SumUpTransactionRepository;
}
