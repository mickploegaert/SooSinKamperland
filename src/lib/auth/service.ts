import "server-only";
import type { NextRequest } from "next/server";
import { getDataProvider } from "@/lib/data";
import type { AdminProfile } from "@/lib/data/types";
import { localAuthService } from "./local-auth";

export type SignInResult =
  | { ok: true; admin: AdminProfile }
  | { ok: false; reason: "invalid-credentials" | "unavailable" };

/**
 * Contract voor authenticatie. De lokale implementatie gebruikt eigen
 * wachtwoordhashes en een ondertekende cookie; een Supabase-implementatie
 * gebruikt straks `supabase.auth.signInWithPassword` en `signOut`.
 */
export interface AuthService {
  signIn(identifier: string, password: string): Promise<SignInResult>;
  signOut(): Promise<void>;
  getCurrentAdmin(): Promise<AdminProfile | null>;
  /** Snelle controle voor de proxy: alleen de cookie, geen database. */
  hasValidSession(request: NextRequest): Promise<boolean>;
}

export function getAuthService(): AuthService {
  if (getDataProvider() === "supabase") {
    throw new Error("Supabase Auth is nog niet gekoppeld. Zie docs/supabase.md.");
  }
  return localAuthService;
}
