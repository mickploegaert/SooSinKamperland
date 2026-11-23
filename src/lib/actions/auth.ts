"use server";

import { redirect } from "next/navigation";
import { LOGIN_PATH } from "@/lib/auth/dal";
import { getAuthService } from "@/lib/auth/service";

/**
 * Beëindigt de sessie en stuurt door naar de inlogpagina. Ook als de sessie al
 * verlopen was, komt de beheerder gewoon op de inlogpagina uit.
 */
export async function logout(): Promise<void> {
  try {
    await getAuthService().signOut();
  } catch (error) {
    console.error("Uitloggen mislukt", error);
  }
  redirect(`${LOGIN_PATH}?uitgelogd=1`);
}
