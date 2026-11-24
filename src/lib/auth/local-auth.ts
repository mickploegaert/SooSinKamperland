import "server-only";
import { cookies } from "next/headers";
import { getDatabase } from "@/lib/data";
import type { Admin, AdminProfile } from "@/lib/data/types";
import { hashPassword, verifyPassword } from "./password";
import type { AuthService } from "./service";
import {
  decryptSession,
  encryptSession,
  SESSION_COOKIE,
  SESSION_DURATION_MS,
  sessionCookieOptions,
} from "./session";

function toProfile(admin: Admin): AdminProfile {
  const { passwordHash: _passwordHash, ...profile } = admin;
  void _passwordHash;
  return profile;
}

// Wordt gebruikt als er geen account gevonden is, zodat het antwoord even lang
// duurt als bij een bestaand account (geen informatie over bestaande accounts).
let dummyHash: Promise<string> | null = null;

export const localAuthService: AuthService = {
  async signIn(identifier, password) {
    let admin: Admin | null;
    try {
      admin = await getDatabase().admins.findByIdentifier(identifier);
    } catch {
      return { ok: false, reason: "unavailable" };
    }

    if (!admin) {
      dummyHash ??= hashPassword("geen-account-gevonden");
      await verifyPassword(password, await dummyHash);
      return { ok: false, reason: "invalid-credentials" };
    }

    let valid: boolean;
    try {
      valid = await verifyPassword(password, admin.passwordHash);
    } catch {
      return { ok: false, reason: "unavailable" };
    }
    if (!valid) return { ok: false, reason: "invalid-credentials" };

    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    const token = await encryptSession({ adminId: admin.id }, expiresAt);
    (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));

    return { ok: true, admin: toProfile(admin) };
  },

  async signOut() {
    (await cookies()).delete(SESSION_COOKIE);
  },

  async getCurrentAdmin() {
    const session = await decryptSession((await cookies()).get(SESSION_COOKIE)?.value);
    if (!session) return null;
    const admin = await getDatabase().admins.findById(session.adminId);
    return admin ? toProfile(admin) : null;
  },

  async hasValidSession(request) {
    return (await decryptSession(request.cookies.get(SESSION_COOKIE)?.value)) !== null;
  },
};
