import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabaseConfig, getSupabaseSecretKey, SESSION_COOKIE_OPTIONS } from "./config";

/**
 * Supabase-client voor het huidige verzoek. Gebruikt de sessiecookies van de
 * bezoeker, dus RLS bepaalt wat er gelezen en gewijzigd mag worden:
 * - zonder sessie (bezoeker): rol `anon`, alleen openbare gegevens;
 * - met sessie van een beheerder: rol `authenticated` + beheerderregels.
 */
export async function createSessionClient() {
  const { url, publishableKey } = getSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient(url, publishableKey, {
    cookieOptions: SESSION_COOKIE_OPTIONS,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // In een Server Component kunnen geen cookies worden gezet. Dat is
          // geen probleem: de proxy (src/proxy.ts) ververst de sessie al.
        }
      },
    },
  });
}

/**
 * Client met de secret key: omzeilt RLS. Wordt alleen gebruikt om bij het
 * inloggen een gebruikersnaam om te zetten naar een e-mailadres, omdat een
 * bezoeker die nog niet is ingelogd de tabel beheerder niet mag lezen.
 */
export function createSecretClient() {
  const { url } = getSupabaseConfig();
  return createClient(url, getSupabaseSecretKey(), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
