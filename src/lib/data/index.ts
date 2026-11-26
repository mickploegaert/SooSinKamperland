import "server-only";
import { localDatabase } from "./local";
import { supabaseDatabase } from "./supabase";
import type { Database } from "./repositories";

export type DataProvider = "local" | "supabase";

export function getDataProvider(): DataProvider {
  return process.env.DATA_PROVIDER === "supabase" ? "supabase" : "local";
}

/**
 * Geeft de actieve gegevensopslag terug.
 * - `local` (standaard): JSON-bestand in `.data/`, bedoeld voor ontwikkeling.
 * - `supabase`: de Supabase-database, zie docs/supabase.md.
 */
export function getDatabase(): Database {
  return getDataProvider() === "supabase" ? supabaseDatabase : localDatabase;
}

export type { Database } from "./repositories";
