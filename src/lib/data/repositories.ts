import type { Admin } from "./types";

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

export interface Database {
  admins: AdminRepository;
}
