import "server-only";

/**
 * Instellingen voor Supabase. Alle sleutels worden alleen op de server
 * gebruikt; daarom hebben ze geen NEXT_PUBLIC_-voorvoegsel en komen ze nooit
 * in de browser terecht.
 */
export type SupabaseConfig = {
  url: string;
  /** Publishable key (sb_publishable_...). Werkt onder RLS als bezoeker of als ingelogde beheerder. */
  publishableKey: string;
};

export function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    throw new Error(
      "SUPABASE_URL of SUPABASE_PUBLISHABLE_KEY ontbreekt. Zie docs/supabase.md.",
    );
  }
  return { url, publishableKey };
}

/**
 * De sessiecookies worden alleen op de server gelezen, dus JavaScript in de
 * browser hoeft er niet bij (httpOnly). Dat beschermt de sessie tegen XSS.
 */
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const;

/** Secret key (sb_secret_...). Omzeilt RLS: alleen gebruiken waar het echt moet. */
export function getSupabaseSecretKey(): string {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) {
    throw new Error("SUPABASE_SECRET_KEY ontbreekt. Zie docs/supabase.md.");
  }
  return key;
}
