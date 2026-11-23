import "server-only";
import { localDatabase } from "./local";
import type { Database } from "./repositories";

export type DataProvider = "local" | "supabase";

export function getDataProvider(): DataProvider {
  return process.env.DATA_PROVIDER === "supabase" ? "supabase" : "local";
}

/**
 * Geeft de actieve gegevensopslag terug.
 * - `local` (standaard): JSON-bestand in `.data/`, bedoeld voor ontwikkeling.
 * - `supabase`: nog te koppelen, zie docs/supabase.md.
 */
export function getDatabase(): Database {
  const provider = getDataProvider();
  if (provider === "supabase") {
    throw new Error(
      "DATA_PROVIDER=supabase is nog niet gekoppeld. Volg docs/supabase.md om de Supabase-adapter toe te voegen.",
    );
  }
  return localDatabase;
}

export type { Database } from "./repositories";
