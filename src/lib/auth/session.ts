import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { jwtVerify, SignJWT } from "jose";

/**
 * Stateless sessie in een ondertekende, httpOnly cookie (JWT, HS256).
 * Alleen het beheerders-id staat erin, geen persoonsgegevens.
 */

export const SESSION_COOKIE = "soos_sessie";
export const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // één werkdag

export type SessionPayload = {
  adminId: number;
};

let cachedKey: Uint8Array | null = null;

async function getSecretKey(): Promise<Uint8Array> {
  if (cachedKey) return cachedKey;

  let secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET ontbreekt. Zet deze variabele in de omgeving.");
    }
    // Alleen voor ontwikkeling: bewaar een willekeurig geheim in .data/.
    const file = path.join(process.cwd(), ".data", "session-secret");
    try {
      secret = (await readFile(file, "utf8")).trim();
    } catch {
      secret = randomBytes(32).toString("base64");
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, secret, "utf8");
    }
  }

  cachedKey = new TextEncoder().encode(secret);
  return cachedKey;
}

export async function encryptSession(payload: SessionPayload, expiresAt: Date) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(await getSecretKey());
}

export async function decryptSession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, await getSecretKey(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.adminId !== "number") return null;
    return { adminId: payload.adminId };
  } catch {
    return null;
  }
}

export function sessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires: expiresAt,
  };
}
