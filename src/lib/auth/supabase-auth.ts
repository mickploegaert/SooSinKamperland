import "server-only";
import { createServerClient } from "@supabase/ssr";
import { AuthApiError } from "@supabase/supabase-js";
import { cache } from "react";
import { getDatabase } from "@/lib/data";
import { type BeheerderRow, toAdmin } from "@/lib/data/supabase/rows";
import type { AdminProfile } from "@/lib/data/types";
import { getSupabaseConfig, SESSION_COOKIE_OPTIONS } from "@/lib/supabase/config";
import { createSessionClient } from "@/lib/supabase/server";
import type { AuthService, SessionCheck } from "./service";

/**
 * Inloggen via Supabase Auth. Supabase bewaart en hasht de wachtwoorden; de
 * sessie staat in httpOnly-cookies die @supabase/ssr beheert.
 *
 * Alleen gebruikers die ook in de tabel `beheerder` staan, mogen het dashboard
 * in. Een account in Supabase Auth alleen is dus niet genoeg.
 */

function toProfile(row: BeheerderRow): AdminProfile {
  const { passwordHash: _passwordHash, ...profile } = toAdmin(row);
  void _passwordHash;
  return profile;
}

/** Profiel van de ingelogde gebruiker, of null als die geen beheerder is. */
async function loadOwnProfile(
  db: Awaited<ReturnType<typeof createSessionClient>>,
  authUserId: string,
): Promise<AdminProfile | null> {
  const { data, error } = await db
    .from("beheerder")
    .select("beheerder_id, gebruikersnaam, email, aangemaakt_op")
    .eq("auth_user_id", authUserId)
    .maybeSingle<BeheerderRow>();
  if (error) throw new Error(`Supabase: ${error.message}`);
  return data ? toProfile(data) : null;
}

export const supabaseAuthService: AuthService = {
  async signIn(identifier, password) {
    // Bij een gebruikersnaam eerst het bijbehorende e-mailadres opzoeken.
    let email = identifier.trim();
    if (!email.includes("@")) {
      let admin;
      try {
        admin = await getDatabase().admins.findByIdentifier(email);
      } catch (error) {
        console.error("Beheerder opzoeken mislukt", error);
        return { ok: false, reason: "unavailable" };
      }
      // Zelfde melding als bij een fout wachtwoord: verraad niet welke accounts bestaan.
      if (!admin) return { ok: false, reason: "invalid-credentials" };
      email = admin.email;
    }

    const db = await createSessionClient();
    const { data, error } = await db.auth.signInWithPassword({ email, password });
    if (error) {
      const invalid =
        error instanceof AuthApiError &&
        (error.code === "invalid_credentials" || error.code === "email_not_confirmed" || error.status === 400);
      if (!invalid) console.error("Supabase Auth gaf een fout", error);
      return { ok: false, reason: invalid ? "invalid-credentials" : "unavailable" };
    }

    const profile = await loadOwnProfile(db, data.user.id);
    if (!profile) {
      // Wel een Supabase-account, maar geen beheerder: direct weer uitloggen.
      await db.auth.signOut();
      return { ok: false, reason: "invalid-credentials" };
    }
    return { ok: true, admin: profile };
  },

  async signOut() {
    const db = await createSessionClient();
    // Beëindigt de sessie bij Supabase en verwijdert de sessiecookies.
    await db.auth.signOut();
  },

  getCurrentAdmin: cache(async () => {
    const db = await createSessionClient();
    // getUser() vraagt het na bij Supabase Auth. Zo werkt een gekopieerde
    // cookie na uitloggen niet meer, ook al is het token nog niet verlopen
    // (getClaims() controleert alleen de handtekening). Dit is de echte
    // controle; de proxy doet alleen een snelle, optimistische check.
    const { data, error } = await db.auth.getUser();
    if (error || !data.user) return null;
    return loadOwnProfile(db, data.user.id);
  }),

  async checkSession(request): Promise<SessionCheck> {
    const { url, publishableKey } = getSupabaseConfig();
    const cookiesToSet: SessionCheck["cookiesToSet"] = [];
    const headers: Record<string, string> = {};

    const db = createServerClient(url, publishableKey, {
      cookieOptions: SESSION_COOKIE_OPTIONS,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies, cacheHeaders) {
          // Ververste tokens doorgeven aan de rest van dit verzoek én aan de browser.
          for (const { name, value } of cookies) request.cookies.set(name, value);
          cookiesToSet.push(...cookies);
          Object.assign(headers, cacheHeaders);
        },
      },
    });

    // Ververst zo nodig het verlopen toegangstoken en controleert bij Supabase
    // of de sessie nog bestaat (zelfde controle als getCurrentAdmin, zodat een
    // uitgelogde sessie niet heen en weer wordt gestuurd tussen /inloggen en /dashboard).
    const { data, error } = await db.auth.getUser();
    return { loggedIn: !error && Boolean(data.user), cookiesToSet, headers };
  },
};
