import "server-only";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

/**
 * Wachtwoordhashing voor de lokale opslag (scrypt met unieke salt per
 * wachtwoord). Zodra Supabase Auth gebruikt wordt, hasht Supabase de
 * wachtwoorden zelf met bcrypt en is dit bestand niet meer nodig.
 */

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number },
) => Promise<Buffer>;

const N = 16384;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEY_LENGTH, { N, r: R, p: P });
  return ["scrypt", N, R, P, salt.toString("base64"), hash.toString("base64")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, n, r, p, salt, hash] = stored.split("$");
  if (algorithm !== "scrypt" || !salt || !hash) return false;

  const expected = Buffer.from(hash, "base64");
  const actual = await scrypt(password, Buffer.from(salt, "base64"), expected.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  });
  return timingSafeEqual(actual, expected);
}

/** Wachtwoordbeleid uit het ontwerpdocument: min. 12 tekens, hoofdletter, kleine letter, cijfer en speciaal teken. */
export function passwordPolicyErrors(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 12) errors.push("minimaal 12 tekens");
  if (!/[A-Z]/.test(password)) errors.push("een hoofdletter");
  if (!/[a-z]/.test(password)) errors.push("een kleine letter");
  if (!/[0-9]/.test(password)) errors.push("een cijfer");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("een speciaal teken");
  return errors;
}
