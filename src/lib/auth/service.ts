import "server-only";
import type { NextRequest, NextResponse } from "next/server";
import { getDataProvider } from "@/lib/data";
import type { AdminProfile } from "@/lib/data/types";
import { localAuthService } from "./local-auth";
import { supabaseAuthService } from "./supabase-auth";

export type SignInResult =
  | { ok: true; admin: AdminProfile }
  | { ok: false; reason: "invalid-credentials" | "unavailable" };

type CookieOptions = Parameters<NextResponse["cookies"]["set"]>[2];

/** Resultaat van de sessiecontrole in de proxy. */
export type SessionCheck = {
  loggedIn: boolean;
  /** Ververste sessiecookies die met het antwoord mee terug moeten (Supabase). */
  cookiesToSet: { name: string; value: string; options?: CookieOptions }[];
  /** Cache-headers die voorkomen dat een antwoord met sessiecookies wordt gecachet. */
  headers: Record<string, string>;
};

/**
 * Contract voor authenticatie, met twee implementaties:
 * - lokaal: eigen wachtwoordhashes en een ondertekende cookie;
 * - Supabase: Supabase Auth met sessiecookies van @supabase/ssr.
 */
export interface AuthService {
  signIn(identifier: string, password: string): Promise<SignInResult>;
  signOut(): Promise<void>;
  getCurrentAdmin(): Promise<AdminProfile | null>;
  /** Snelle controle voor de proxy. Ververst bij Supabase ook een verlopen token. */
  checkSession(request: NextRequest): Promise<SessionCheck>;
}

export function getAuthService(): AuthService {
  return getDataProvider() === "supabase" ? supabaseAuthService : localAuthService;
}
